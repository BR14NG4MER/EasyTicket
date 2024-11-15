"use client";
import { Box, Flex, Link, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Elimina la sesión almacenada en localStorage
    localStorage.removeItem("session");

    // Redirige al usuario a la página de inicio
    router.push("/");
  };

  return (
    <Box bg="#00A3C4" px={4} py={2}>
      <Flex align="center" justify="space-between">
        {/* Logo y nombre de la aplicación */}
        <Text fontSize="xl" fontWeight="bold" as="a" href="#" padding={15}>
          EASYTICKET
        </Text>

        {/* Links de Navegación */}
        <Flex align="center" gap={6}>
          <Link href="/home" fontSize="lg" color="white">
            Inicio
          </Link>
          <Link href="/panel" fontSize="lg" color="white">
            Panel
          </Link>
          <Link href="/settings" fontSize="lg" color="white">
            Configuración
          </Link>
        </Flex>

        {/* Botón de Cerrar Sesión */}
        <Button
          bg="#FF5C5C"
          color="white"
          size="md"
          borderRadius="10px"
          shadow="md"
          _hover={{
            bg: "#FF4040",
            transform: "scale(1.05)"
          }}
          _active={{
            bg: "#E63946",
            transform: "scale(0.98)"
          }}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
