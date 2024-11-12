"use client";
import React, { useEffect, useState } from "react";
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
  Stack,
  IconButton,
  Divider,
  Select,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
import axios from 'axios';

interface Ticket {
  id: number;
  titulo: string;
  asunto: string;
  usuario_id: number | null;
  nombre: string;
  estado_nombre: string;
  soporte_id: number;
}

const apiUrl = "http://localhost:5000/api";

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
};

const TicketManagement = () => {
  const [allTickets, setTicket] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [supports, setSupports] = useState<any[]>([]);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTicketsAndUsersAndSupports = async () => {
      const tickets = await fetchData(`${apiUrl}/all_tickets`);
      const users = await fetchData(`${apiUrl}/all_users`);
      const supports = await fetchData(`${apiUrl}/all_supports`);
      setTicket(tickets);
      setUsers(users);
      setSupports(supports);
    };
    fetchTicketsAndUsersAndSupports();
  }, []);

  const getUserNameById = (userId: number | null) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.nombre : "Usuario no encontrado";
  };

  const getSupportNameById = (supportId: number | null) => {
    const support = supports.find((support) => support.soporte_id === supportId);
    return support ? support.soporte_nombre : "Soporte no asignado";
  };



  const handleTicketForm = async (ticketData: any, method: string, id?: number) => {
    try {
      const url = method === "update" ? `${apiUrl}/update_ticket/${id}` : `${apiUrl}/add_ticket`;
      const response = method === "update"
        ? await axios.put(url, ticketData)
        : await axios.post(url, ticketData);

      const updatedTicket = {
        ...ticketData,
        id: response.data.id || id,
        soporte_id: response.data.soporte_id,
        nombre: getUserNameById(ticketData.usuario_id),
      };

      if (method === "update") {
        setTicket(allTickets.map(ticket => ticket.id === id ? updatedTicket : ticket));
      } else {
        setTicket([...allTickets, updatedTicket]);
    
      }

      setTicketTitle("");
      setTicketDescription("");
      setSelectedUserId(null);
      setEditingTicketIndex(null);
      setError("");
    } catch (error) {
      console.error(`Error al ${method === "update" ? "actualizar" : "agregar"} el ticket:`, error);
    }
  };

  const handleAddTicket = () => {
    if (!selectedUserId) {
      setError("Por favor, selecciona un usuario.");
      return;
    }
    const newTicket = {
      titulo: ticketTitle,
      asunto: ticketDescription,
      usuario_id: selectedUserId,
    };
    handleTicketForm(newTicket, "add");
  };

  const handleEditTicket = (id: number) => {
    const ticketToEdit = allTickets.find(tckts => tckts.id === id);
    if (ticketToEdit) {
      setTicketTitle(ticketToEdit.titulo);
      setTicketDescription(ticketToEdit.asunto);
      setSelectedUserId(ticketToEdit.usuario_id);
      setEditingTicketIndex(id);
      setError("");
    }
  };

  const handleUpdateTicket = () => {
    if (!selectedUserId) {
      setError("Por favor, selecciona un usuario.");
      return;
    }
    if (editingTicketIndex !== null) {
      const updatedTicket = {
        titulo: ticketTitle,
        asunto: ticketDescription,
        usuario_id: selectedUserId,
      };
      handleTicketForm(updatedTicket, "update", editingTicketIndex);
    }
  };

  const handleDeleteTicket = (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este ticket?");
    if (confirmDelete) {
      axios.delete(`${apiUrl}/delete_ticket/${id}`)
        .then(() => {
          setTicket(allTickets.filter(ticket => ticket.id !== id));
          alert("Ticket eliminado");
        })
        .catch((error) => {
          console.log("Error al eliminar el ticket:", error);
          alert("Ocurrió un error");
        });
    } else {
      alert("Operación cancelada");
    }
  };

  return (
    <div>
      <Navbar />
      <Box bg="#1A202C" color="white" minH="100vh" p={8}>
        <VStack spacing={10} width="100%" maxW="4xl" mx="auto">
          <Heading as="h2" size="lg" textAlign="center" mb={4}>Gestión de Tickets</Heading>
          <Box width="100%" bg="#2D3748" p={6} borderRadius="md" boxShadow="lg">
            <Heading as="h3" size="md" mb={4}>{editingTicketIndex !== null ? "Editar Ticket" : "Agregar Ticket"}</Heading>
            <Stack spacing={4} direction={{ base: "column", md: "row" }} width="100%">
              <FormControl id="ticketTitle" isRequired>
                <FormLabel>Título del Ticket</FormLabel>
                <Input
                  type="text"
                  placeholder="Introduce el título del ticket"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  bg="#1A202C"
                  color="white"
                  _placeholder={{ color: "#A0AEC0" }}
                  minW="250px"
                />
              </FormControl>
              <FormControl id="ticketDescription" isRequired>
                <FormLabel>Descripción</FormLabel>
                <Input
                  type="text"
                  placeholder="Introduce la descripción del ticket"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  bg="#1A202C"
                  color="white"
                  _placeholder={{ color: "#A0AEC0" }}
                  minW="250px"
                />
              </FormControl>
              <FormControl id="ticketUser" isRequired>
                <FormLabel>Selecciona un Usuario</FormLabel>
                <Select
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  bg="#1A202C"
                  color="white"
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.nombre}</option>
                  ))}
                </Select>
                {error && <Text color="red.500" fontSize="sm">{error}</Text>}
              </FormControl>
              <Button
                onClick={() => editingTicketIndex !== null ? handleUpdateTicket() : handleAddTicket()}
                bg="#319795"
                color="white"
                size="md"
                fontSize="md"
                _hover={{ bg: "#2C7A7B" }}
                alignSelf="flex-end"
                minW="150px"
              >
                {editingTicketIndex !== null ? "Actualizar Ticket" : "Agregar Ticket"}
              </Button>
            </Stack>
          </Box>

          <Divider />
          <Box width="100%" mt={6}>
            <Table variant="simple" colorScheme="teal" size="md" boxShadow="md" borderRadius="md">
              <Thead bg="#2D3748">
                <Tr>
                  <Th color="white">Título</Th>
                  <Th color="white">Descripción</Th>
                  <Th color="white">Usuario</Th>
                  <Th color="white">Soporte</Th>
                  <Th color="white">Estado</Th>
                  <Th color="white">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allTickets.length > 0 ? (
                  allTickets.map(ticket => (
                    <Tr key={ticket.id}>
                      <Td>{ticket.titulo}</Td><Td>{ticket.asunto}</Td><Td>{ticket.nombre}</Td>
                      <Td>{getSupportNameById(ticket.soporte_id)}</Td><Td>{ticket.estado_nombre || "Pendiente"}</Td>
                      <Td>
                        <IconButton aria-label="Editar" icon={<EditIcon />} colorScheme="blue" size="sm" mr={2} onClick={() => handleEditTicket(ticket.id)} />
                        <IconButton aria-label="Eliminar" icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => handleDeleteTicket(ticket.id)} />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center">No hay tickets añadidos.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Box>
    </div>
  );
};

export default TicketManagement;
