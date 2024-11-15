"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, Input, VStack, Flex, Text, useToast } from "@chakra-ui/react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Verifica si ya existe una sesión activa
    const session = localStorage.getItem("session");
    if (session) {
      router.push("/home"); // Redirige a /home si hay sesión
    } else {
      setIsLoading(false); // Finaliza la carga solo si no hay sesión
    }
  }, [router]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Por favor, ingresa todos los campos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("session", JSON.stringify(data.session));
        toast({
          title: "Inicio de sesión exitoso",
          description: data.message || "Bienvenido a EASYTICKET",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/home");
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: data.message || "Credenciales incorrectas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar al servidor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Renderiza solo cuando isLoading es false
  if (isLoading) {
    return null; // Evita mostrar el componente hasta que se verifique la sesión
  }

  return (
    <Box bg="#1A202C" color="white" minH="100vh">
      <Box bg="#00A3C4" px={4} py={2}>
        <Flex align="center" justify="space-between">
          <Text fontSize="xl" fontWeight="bold" as="a" href="#" padding={15}>
            EASYTICKET
          </Text>
        </Flex>
      </Box>

      <Box
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        width="100%"
        maxWidth="500px"
        margin="auto"
        mt={12}
        color="black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Box width="100%" p={8} bg="#00A3C4" borderRadius="lg" boxShadow="xl">
          <Flex justify="center" mb={6}>
            <Text fontSize="40px" fontWeight="bold" color="#1A202C">
              Bienvenido@
            </Text>
          </Flex>

          <VStack spacing={6} align="stretch" display="flex" alignItems="center" justifyContent="center">
            <FormControl isRequired>
              <FormLabel htmlFor="username" fontWeight="bold" color="black" fontSize="25px">
                Nombre de usuario
              </FormLabel>
              <Input
                id="username"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="gray.100"
                borderRadius="10px"
                fontSize="25px"
                padding="5px"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password" fontWeight="bold" color="black" fontSize="25px">
                Contraseña
              </FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.100"
                borderRadius="10px"
                fontSize="25px"
                padding="5px"
              />
            </FormControl>
            <Button
              colorScheme="teal"
              onClick={handleLogin}
              width="full"
              mt={4}
              _hover={{
                bg: "#0000ff6b",
                transform: "scale(0.9)",
                transition: "transform 1s",
              }}
              fontSize="20px"
              fontWeight="bold"
              bg="blue"
              padding="10px"
              color="white"
            >
              Iniciar sesión
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
