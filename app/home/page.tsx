"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Text,
  Divider,
  Button,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { InfoIcon, RepeatIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
/* Libreria para base de datos */
import axios from 'axios';
import withAuth from "../components/withAuth";

interface Status {
  estado_id: number;
  qty: number;
}

interface Last {
  id: number,
  time: string;
  solved: string;
}

interface LastCreated {
  id: number,
  created: string;
}

interface AVGTime {
  avg_time: string;
}

interface CreatedTickets {
  id: number,
  created: string;
  estado_nombre: string;
}




function Home() {

  const [stats, setStatus] = useState<Status[]>([]);
  const [last, setLast] = useState<Last[]>([]);
  const [avgTime, setAVG] = useState<AVGTime[]>([]);
  const [lastCreated, setLastCreated] = useState<LastCreated[]>([]);
  const [createdTickets, setCreatedTickets] = useState<CreatedTickets[]>([]);

  useEffect(() => {
    // Usamos Promise.all para hacer las consultas en paralelo
    Promise.all([
      axios.get<Status[]>('http://localhost:5000/api/tickets_status'),
      axios.get<Last[]>('http://localhost:5000/api/last_solved_ticket'),
      axios.get<AVGTime[]>('http://localhost:5000/api/avg_solved_ticket'),
      axios.get<LastCreated[]>('http://localhost:5000/api/last_created_ticket'),
      axios.get<CreatedTickets[]>('http://localhost:5000/api/created_tickets'),
    ])
      .then(([responseStatus, responseLast, responseAVG, responseLastCreated, responseCreatedTickets]) => {
        setStatus(responseStatus.data);
        setLast(responseLast.data);
        setAVG(responseAVG.data);
        setLastCreated(responseLastCreated.data);
        setCreatedTickets(responseCreatedTickets.data);
      })
      .catch((error) => {
        console.log('Hubo un error al obtener los resultados', error);
      });
  }, []);



  // Datos de ejemplo


  const openTickets = stats.find(stat => stat.estado_id === 3)?.qty ?? 0;
  const noSolvedTickets = stats.find(stat => stat.estado_id === 4)?.qty ?? 0;
  const resolvedTickets = stats.find(stat => stat.estado_id === 2)?.qty ?? 0;
  const pendingTickets = stats.find(stat => stat.estado_id === 1)?.qty ?? 0;
  const totalTickets = openTickets + noSolvedTickets + resolvedTickets + pendingTickets;
  const avgResponseTime = last[0]?.time ?? 'No disponible';
  const avgGlobalTime = avgTime[0]?.avg_time ?? 'No disponible';
  const lasTicket = last[0]?.id ?? 'No disponible';
  const lastSolved = last[0]?.solved ?? 'No disponible';
  const lastCreate = lastCreated[0]?.created ?? 'No disponible';
  const notifications = [
    { message: "Nuevo ticket de alta prioridad", timestamp: "Hace " + lastCreate },
    { message: "Ticket #" + lasTicket + " fue resuelto", timestamp: "Hace: " + lastSolved },
  ];


  return (
    <Box bg="#1A202C" color="white" minH="100vh">
      <Navbar />
      <Box padding={8}>
        <div>
          <VStack spacing={8} width="100%" maxW="6xl" mx="auto">
            <Heading as="h2" size="xl" textAlign="center" mb={8}>
              Resumen del Sistema de Soporte
            </Heading>

            {/* Sección de Estadísticas */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%">
              <div className="grid grid-cols-2">
                <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
                  <StatLabel>Total de Tickets </StatLabel>
                  <StatNumber>{totalTickets} </StatNumber>
                  {/* <StatHelpText>Total en el sistema</StatHelpText> */}
                </Stat>
                <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
                  <StatLabel>Tickets Abiertos</StatLabel>
                  <StatNumber>{openTickets}</StatNumber>
                  <StatHelpText>Tickets sin resolver</StatHelpText>
                  <StatNumber>{noSolvedTickets}</StatNumber>
                </Stat>
              </div>
              <div className="grid grid-cols-2">
                <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
                  <StatLabel>Tickets Resueltos</StatLabel>
                  <StatNumber>{resolvedTickets}</StatNumber>
                  {/* <StatHelpText>Tickets completados</StatHelpText> */}
                </Stat>

                <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
                  <StatLabel>Tickets Pendientes</StatLabel>
                  <StatNumber>{pendingTickets}</StatNumber>
                  {/* <StatHelpText>Tickets en espera</StatHelpText> */}
                </Stat>
              </div>

              <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
                <StatLabel>Tiempo de Respuesta del Ultimo Ticket</StatLabel>
                <StatNumber>{avgResponseTime}</StatNumber>
                <StatHelpText>Promedio de tiempo</StatHelpText>
                <StatNumber>{avgGlobalTime}</StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Divider */}
            <Divider orientation="horizontal" />

            {/* Sección de Notificaciones y Actividad Reciente */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
              {/* Notificaciones */}
              <Box bg="#2D3748" p={6} borderRadius="md" boxShadow="lg">
                <Heading as="h3" size="md" mb={4}>
                  Notificaciones
                </Heading>
                {notifications.length > 0 ? (
                  <VStack align="start" spacing={4}>
                    {notifications.map((notification, index) => (
                      <HStack key={index} spacing={4}>
                        <InfoIcon color="teal.400" />
                        <Text>{notification.message}</Text>
                        <Text fontSize="sm" color="gray.400">
                          {notification.timestamp}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text>No hay notificaciones recientes.</Text>
                )}
              </Box>

              {/* Actividad Reciente */}
              <Box bg="#2D3748" p={6} borderRadius="md" boxShadow="lg">
                <Heading as="h3" size="md" mb={4}>
                  Actividad Reciente
                </Heading>
                {createdTickets.length > 0 ? (
                  <VStack align="start" spacing={4}>
                    {createdTickets.map((ticket) => (
                      <HStack key={ticket.id} spacing={4}>
                        <RepeatIcon color="blue.400" />
                        <Text>{`Ticket #${ticket.id} ${ticket.estado_nombre} hace`}</Text> {/* Mostrar el texto de acción */}
                        <Text fontSize="sm" color="gray.400">
                          {ticket.created} {/* Mostrar la fecha de creación del ticket */}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text>No hay tickets creados recientes.</Text>
                )}
              </Box>
            </SimpleGrid>

            {/* Divider */}
            <Divider orientation="horizontal" />

            {/* Acciones Rápidas */}
            <HStack width="100%" justify="center" spacing={6} mt={8}>
              <Button colorScheme="teal" size="lg">
                Crear Nuevo Ticket
              </Button>
              <Button colorScheme="teal" size="lg">
                Ver Todos los Tickets
              </Button>
            </HStack>
          </VStack>
        </div>
      </Box>
    </Box>
  );
}

export default withAuth(Home);