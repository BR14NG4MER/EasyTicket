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
  Divider,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";

function TicketManagement() {
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [tickets, setTickets] = useState<{ title: string; description: string }[]>([]);
  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);
  const toast = useToast();

  const handleAddTicket = () => {
    const newTicket = { title: ticketTitle, description: ticketDescription };
    setTickets([...tickets, newTicket]);
    setTicketTitle("");
    setTicketDescription("");
    toast({
      title: "Ticket agregado.",
      description: "El ticket ha sido agregado correctamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEditTicket = (index: number) => {
    const ticket = tickets[index];
    setTicketTitle(ticket.title);
    setTicketDescription(ticket.description);
    setEditingTicketIndex(index);
  };

  const handleUpdateTicket = () => {
    if (editingTicketIndex !== null) {
      const updatedTickets = [...tickets];
      updatedTickets[editingTicketIndex] = { title: ticketTitle, description: ticketDescription };
      setTickets(updatedTickets);
      setTicketTitle("");
      setTicketDescription("");
      setEditingTicketIndex(null);
      toast({
        title: "Ticket actualizado.",
        description: "El ticket ha sido actualizado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
    toast({
      title: "Ticket eliminado.",
      description: "El ticket ha sido eliminado correctamente.",
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
          Gestión de Tickets
        </Heading>

        {/* Formulario para Agregar/Editar Ticket */}
        <Box width="100%" bg="#2D3748" p={6} borderRadius="md" boxShadow="lg">
          <Heading as="h3" size="md" mb={4}>
            {editingTicketIndex !== null ? "Editar Ticket" : "Agregar Ticket"}
          </Heading>
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
            <Button
              onClick={editingTicketIndex !== null ? handleUpdateTicket : handleAddTicket}
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

        {/* Tabla de Tickets */}
        <Box width="100%" mt={6}>
          <Table variant="simple" colorScheme="teal" size="md" boxShadow="md" borderRadius="md">
            <Thead bg="#2D3748">
              <Tr>
                <Th color="white">Título</Th>
                <Th color="white">Descripción</Th>
                <Th color="white">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket, index) => (
                  <Tr key={index}>
                    <Td>{ticket.title}</Td>
                    <Td>{ticket.description}</Td>
                    <Td>
                      <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        size="sm"
                        mr={2}
                        onClick={() => handleEditTicket(index)}
                      />
                      <IconButton
                        aria-label="Eliminar"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteTicket(index)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    No hay tickets añadidos.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
    </div>
  );
}

export default TicketManagement;
