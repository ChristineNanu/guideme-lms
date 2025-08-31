import React from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaUserShield, FaRocket } from "react-icons/fa";
import { Box, Flex, Heading, Text, Button, VStack, SimpleGrid } from "@chakra-ui/react";

export default function LandingPage() {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.500, purple.500, pink.500)">
      
      {/* Hero Section */}
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        textAlign="center" 
        color="white" 
        py={28} 
        px={6}
      >
        <Heading fontSize={{ base: "4xl", md: "6xl" }} fontWeight="extrabold" mb={4} textShadow="0 0 10px rgba(0,0,0,0.2)">
          GuideMe LMS
        </Heading>
        <Text fontSize={{ base: "md", md: "xl" }} maxW="xl" mb={8} opacity={0.9}>
          Your step-by-step learning assistant. Simplify your LMS experience, access guides instantly, and never get lost again.
        </Text>
        <Flex gap={4} wrap="wrap" justify="center">
          <Button 
            as={Link} 
            to="/login" 
            bg="white" 
            color="blue.600" 
            px={6} py={3} 
            fontWeight="semibold" 
            shadow="md"
            _hover={{ bg: "gray.100", transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Login
          </Button>
          <Button 
            as={Link} 
            to="/register" 
            bg="purple.600" 
            color="white" 
            px={6} py={3} 
            fontWeight="semibold" 
            shadow="md"
            _hover={{ bg: "purple.700", transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Create Account
          </Button>
        </Flex>
      </Flex>

      {/* Features Section */}
      <Box 
        bg="white" 
        roundedTop="3xl" 
        shadow="2xl" 
        p={10} 
        mt={-16}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} textAlign="center">
          <VStack p={6} rounded="xl" shadow="md" _hover={{ shadow: "lg", transform: "scale(1.05)" }} transition="all 0.2s">
            <FaBookOpen className="text-blue-600" style={{ fontSize: "3rem" }} />
            <Heading size="md">Easy Step Guides</Heading>
            <Text color="gray.600" fontSize="sm">
              Follow clear instructions to navigate your LMS without confusion.
            </Text>
          </VStack>

          <VStack p={6} rounded="xl" shadow="md" _hover={{ shadow: "lg", transform: "scale(1.05)" }} transition="all 0.2s">
            <FaUserShield className="text-purple-600" style={{ fontSize: "3rem" }} />
            <Heading size="md">Secure Access</Heading>
            <Text color="gray.600" fontSize="sm">
              Your data stays private with our secure authentication system.
            </Text>
          </VStack>

          <VStack p={6} rounded="xl" shadow="md" _hover={{ shadow: "lg", transform: "scale(1.05)" }} transition="all 0.2s">
            <FaRocket className="text-pink.500" style={{ fontSize: "3rem" }} />
            <Heading size="md">Get Started Fast</Heading>
            <Text color="gray.600" fontSize="sm">
              Sign up in seconds and start using your LMS assistant immediately.
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Footer */}
      <Box textAlign="center" color="white" py={6} opacity={0.8} mt={6}>
        © {new Date().getFullYear()} GuideMe LMS — All rights reserved
      </Box>

    </Box>
  );
}
