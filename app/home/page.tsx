"use client";
import React from "react";
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

function Home() {
  // Datos de ejemplo
  const totalTickets = 120;
  const openTickets = 30;
  const resolvedTickets = 80;
  const pendingTickets = 10;
  const avgResponseTime = "2h 30m";
  const notifications = [
    { message: "Nuevo ticket de alta prioridad", timestamp: "Hace 5 minutos" },
    { message: "Ticket #45 fue resuelto", timestamp: "Hace 1 hora" },
  ];
  const recentActivity = [
    { id: 1, action: "Ticket #50 creado", timestamp: "Hace 2 horas" },
    { id: 2, action: "Ticket #49 actualizado", timestamp: "Hace 3 horas" },
  ];

  return (
    <Box bg="#1A202C" color="white" minH="100vh">
        <Navbar/>
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
            <StatLabel>Total de Tickets</StatLabel>
            <StatNumber>{totalTickets}</StatNumber>
            <StatHelpText>Total en el sistema</StatHelpText>
            </Stat>
            <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
            <StatLabel>Tickets Abiertos</StatLabel>
            <StatNumber>{openTickets}</StatNumber>
            <StatHelpText>Tickets sin resolver</StatHelpText>
            </Stat>
            </div>
            <div className="grid grid-cols-2">
            <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
            <StatLabel>Tickets Resueltos</StatLabel>
            <StatNumber>{resolvedTickets}</StatNumber>
            <StatHelpText>Tickets completados</StatHelpText>
          </Stat>

          <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
            <StatLabel>Tickets Pendientes</StatLabel>
            <StatNumber>{pendingTickets}</StatNumber>
            <StatHelpText>Tickets en espera</StatHelpText>
          </Stat>
            </div>

          <Stat bg="#2D3748" p={4} borderRadius="md" boxShadow="lg">
            <StatLabel>Tiempo de Respuesta</StatLabel>
            <StatNumber>{avgResponseTime}</StatNumber>
            <StatHelpText>Promedio de tiempo</StatHelpText>
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
            {recentActivity.length > 0 ? (
              <VStack align="start" spacing={4}>
                {recentActivity.map((activity) => (
                  <HStack key={activity.id} spacing={4}>
                    <RepeatIcon color="blue.400" />
                    <Text>{activity.action}</Text>
                    <Text fontSize="sm" color="gray.400">
                      {activity.timestamp}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text>No hay actividad reciente.</Text>
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

export default Home;