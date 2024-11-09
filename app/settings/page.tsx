"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

function AdminPanel() {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [users, setUsers] = useState<{ name: string; phone: string }[]>([]);
  const toast = useToast();

  const handleAddUser = () => {
    const newUser = { name: userName, phone: userPhone };
    setUsers([...users, newUser]);
    setUserName("");
    setUserPhone("");
    toast({
      title: "Usuario agregado.",
      description: "El usuario ha sido agregado correctamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEditUser = (index: number) => {
    const user = users[index];
    setUserName(user.name);
    setUserPhone(user.phone);
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleDeleteUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
    toast({
      title: "Usuario eliminado.",
      description: "El usuario ha sido eliminado correctamente.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
      bg="#1A202C"
      color="white"
      minH="100vh"
      p={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <VStack spacing={8} width="100%" maxW="4xl">
        <Heading as="h2" size="lg" textAlign="center" mb={4}>
          Panel de Administrador
        </Heading>
        <Stack direction={{ base: "column", md: "row" }} spacing={4} width="100%">
          <FormControl id="userName" isRequired>
            <FormLabel>Nombre del Usuario</FormLabel>
            <Input
              type="text"
              placeholder="Introduce el nombre del usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              bg="#2D3748"
              color="white"
              _placeholder={{ color: "#A0AEC0" }}
              minW="250px"
            />
          </FormControl>
          <FormControl id="userPhone" isRequired>
            <FormLabel>Número de Teléfono</FormLabel>
            <Input
              type="text"
              placeholder="Introduce el número de teléfono"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              bg="#2D3748"
              color="white"
              _placeholder={{ color: "#A0AEC0" }}
              minW="250px"
            />
          </FormControl>
          <Button
            onClick={handleAddUser}
            bg="#319795"
            color="white"
            size="md"
            fontSize="md"
            _hover={{ bg: "#2C7A7B" }}
            alignSelf="flex-end"
            minW="150px"
          >
            Agregar Usuario
          </Button>
        </Stack>
        <Box width="100%" mt={6}>
          <Heading as="h3" size="md" textAlign="left" mb={4}>
            Lista de Usuarios
          </Heading>
          <Table variant="simple" colorScheme="teal" size="md" boxShadow="md" borderRadius="md">
            <Thead bg="#2D3748">
              <Tr>
                <Th color="white">Nombre</Th>
                <Th color="white">Número de Teléfono</Th>
                <Th color="white">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <Tr key={index}>
                    <Td>{user.name}</Td>
                    <Td>{user.phone}</Td>
                    <Td>
                      <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        size="sm"
                        mr={2}
                        onClick={() => handleEditUser(index)}
                      />
                      <IconButton
                        aria-label="Eliminar"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteUser(index)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    No hay usuarios añadidos.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
}

export default AdminPanel;