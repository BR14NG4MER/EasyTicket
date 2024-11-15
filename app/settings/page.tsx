"use client";
import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Table, Thead, Tbody, Tr, Th, Td, useToast, Stack, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
import withAuth from "../components/withAuth";

function AdminPanel() {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [users, setUsers] = useState<{ name: string; phone: string }[]>([]);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPassword, setSupportPassword] = useState("");
  const [supportStaff, setSupportStaff] = useState<{ email: string; password: string }[]>([]);
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

  const handleAddSupport = () => {
    const newSupport = { email: supportEmail, password: supportPassword };
    setSupportStaff([...supportStaff, newSupport]);
    setSupportEmail("");
    setSupportPassword("");
    toast({
      title: "Soporte agregado.",
      description: "El personal de soporte ha sido agregado correctamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEditSupport = (index: number) => {
    const support = supportStaff[index];
    setSupportEmail(support.email);
    setSupportPassword(support.password);
    setSupportStaff(supportStaff.filter((_, i) => i !== index));
  };

  const handleDeleteSupport = (index: number) => {
    setSupportStaff(supportStaff.filter((_, i) => i !== index));
    toast({
      title: "Soporte eliminado.",
      description: "El personal de soporte ha sido eliminado correctamente.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Navbar/>
      <Box bg="#1A202C" color="white" minH="100vh" p={8}>
      <VStack spacing={10} width="100%" maxW="4xl" mx="auto">
        <Heading as="h2" size="lg" textAlign="center" mb={4}>
          Panel de Administrador
        </Heading>

        {/* Sección de Gestión de Usuarios */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Box width="100%" bg="#2D3748" p={6} borderRadius="md" boxShadow="lg">
              <Heading as="h3" size="md" mb={4}>
                Gestión de Usuarios
              </Heading>
              <Stack direction={{ base: "column", md: "row" }} spacing={4} width="100%">
                <FormControl id="userName" isRequired>
                  <FormLabel>Nombre del Usuario</FormLabel>
                  <Input
                    type="text"
                    placeholder="Introduce el nombre del usuario"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    bg="#1A202C"
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
                    bg="#1A202C"
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

              {/* Tabla de Usuarios */}
              <Box width="100%" mt={6}>
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
            </Box>
          </div>

          {/* Sección de Gestión de Soporte */}
          <div>
            <Box width="100%" bg="#2D3748" p={6} borderRadius="md" boxShadow="lg">
              <Heading as="h3" size="md" mb={4}>
                Gestión de Personal de Soporte
              </Heading>
              <Stack direction={{ base: "column", md: "row" }} spacing={4} width="100%">
                <FormControl id="supportEmail" isRequired>
                  <FormLabel>Correo del Soporte</FormLabel>
                  <Input
                    type="email"
                    placeholder="Introduce el correo del soporte"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    bg="#1A202C"
                    color="white"
                    _placeholder={{ color: "#A0AEC0" }}
                    minW="250px"
                  />
                </FormControl>
                <FormControl id="supportPassword" isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    placeholder="Introduce la contraseña"
                    value={supportPassword}
                    onChange={(e) => setSupportPassword(e.target.value)}
                    bg="#1A202C"
                    color="white"
                    _placeholder={{ color: "#A0AEC0" }}
                    minW="250px"
                  />
                </FormControl>
                <Button
                  onClick={handleAddSupport}
                  bg="#319795"
                  color="white"
                  size="md"
                  fontSize="md"
                  _hover={{ bg: "#2C7A7B" }}
                  alignSelf="flex-end"
                  minW="150px"
                >
                  Agregar Soporte
                </Button>
              </Stack>

              {/* Tabla de Soporte */}
              <Box width="100%" mt={6}>
                <Table variant="simple" colorScheme="teal" size="md" boxShadow="md" borderRadius="md">
                  <Thead bg="#2D3748">
                    <Tr>
                      <Th color="white">Correo</Th>
                      <Th color="white">Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {supportStaff.length > 0 ? (
                      supportStaff.map((support, index) => (
                        <Tr key={index}>
                          <Td>{support.email}</Td>
                          <Td>
                            <IconButton
                              aria-label="Editar"
                              icon={<EditIcon />}
                              colorScheme="blue"
                              size="sm"
                              mr={2}
                              onClick={() => handleEditSupport(index)}
                            />
                            <IconButton
                              aria-label="Eliminar"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              size="sm"
                              onClick={() => handleDeleteSupport(index)}
                            />
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={2} textAlign="center">
                          No hay personal de soporte añadido.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </div>
        </div>
      </VStack>
    </Box>
    </div>
  );
}

export default withAuth(AdminPanel);