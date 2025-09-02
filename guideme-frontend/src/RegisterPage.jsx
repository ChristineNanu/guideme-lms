import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Box, Button, Flex, FormControl, FormLabel, Input, Heading, Text, VStack 
} from "@chakra-ui/react";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/register", { email, password });
      
      if (res.data.success) {
        navigate("/login"); // redirect to login page
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Email already registered");
      } else {
        console.error(err);
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100">
      <Box 
        bg="white" 
        p={8} 
        rounded="xl" 
        shadow="lg" 
        w={{ base: "90%", md: "400px" }}
      >
        <VStack spacing={4} align="stretch">
          <Heading size="lg" color="blue.600" textAlign="center">
            Create Your Account
          </Heading>

          {error && <Text color="red.500" textAlign="center">{error}</Text>}

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
            />
          </FormControl>

          <Button 
            colorScheme="blue" 
            size="md" 
            onClick={handleRegister}
          >
            Register
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default RegisterPage;
