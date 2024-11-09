"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  useToast,
  Stack,
} from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes añadir la lógica de autenticación.
    toast({
      title: "Inicio de sesión exitoso.",
      description: "Has iniciado sesión correctamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
  bg="#2D3748"
  color="white"
  minH="100vh"
  display="flex"
  justifyContent="center"
  alignItems="center"
  p={4}
>
  <Box
    maxW="md"
    w="full"
    bg="#4A5568"
    borderRadius="md"
    boxShadow="lg"
    p={8}
  >
    <VStack spacing={4} textAlign="center">
        <Heading as={"h2"} color={"#00ffff"}>
            EASYTICKET
        </Heading>
      <Heading as="h2" size="lg">
        Iniciar Sesión
      </Heading>
      <Text fontSize="md" color="#CBD5E0">
        Introduce tus credenciales para acceder a tu cuenta.
      </Text>
    </VStack>
    <form onSubmit={handleSubmit}>
      <Stack spacing={4} mt={6}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Introduce tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="#4A5568"
            color="white"
            _placeholder={{ color: "#A0AEC0" }}
            borderWidth={"1px"}
            borderColor={"#616161"}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="#4A5568"
            color="white"
            _placeholder={{ color: "#A0AEC0" }}
            borderWidth={"1px"}
            borderColor={"#616161"}
          />
        </FormControl>
        <Button
          type="submit"
          bg="#319795"
          color="white"
          size="lg"
          fontSize="md"
          mt={4}
          _hover={{ bg: "#2C7A7B" }}
        >
          Iniciar Sesión
        </Button>
      </Stack>
    </form>
  </Box>
</Box>

  );
}

export default Login;