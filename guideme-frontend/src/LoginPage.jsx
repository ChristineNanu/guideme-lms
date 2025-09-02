import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Box, Button, Flex, FormControl, FormLabel, Input, Heading, Text, VStack 
} from "@chakra-ui/react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/login", { email, password });
      
      if (res.data.success) {
        // Get username from backend response, fallback to "Learner"
        const username = res.data.username || "Chrissy"; 
        navigate("/guide", { state: { username } }); // pass username via state
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
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
            Login to GuideMe LMS
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
            onClick={handleLogin}
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default LoginPage;
