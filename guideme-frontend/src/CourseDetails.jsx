import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tag,
  HStack,
  useToast,
} from "@chakra-ui/react";

function CourseDetails() {
  const { id } = useParams(); // course ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch course details if page refreshed or no state passed
  useEffect(() => {
    if (!course) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/courses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setCourse(data.course);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch course:", err);
          setError("Could not load course details.");
          setLoading(false);
        });
    }
  }, [course, id]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const phoneNumber = prompt("Enter your M-Pesa phone number (e.g. 2547XXXXXXXX):");
      if (!phoneNumber) {
        toast({
          title: "Payment cancelled",
          description: "Phone number is required to proceed.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setPaymentLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: course.price,
          course_id: id,
          title: course.title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Payment initiated",
          description: "Check your phone to complete the payment via M-Pesa.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Payment failed",
          description: data.error || "Something went wrong. Try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: "Unable to reach the payment server.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    setPaymentLoading(false);
  };

  if (loading) {
    return (
      <VStack minH="100vh" justify="center">
        <Spinner size="xl" />
        <Text>Loading course details...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack minH="100vh" justify="center" spacing={4}>
        <Text color="red.500">{error}</Text>
        <Button colorScheme="blue" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </VStack>
    );
  }

  if (!course) {
    return (
      <VStack minH="100vh" justify="center" spacing={4}>
        <Text>No course found.</Text>
        <Button colorScheme="blue" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </VStack>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Card shadow="xl" borderRadius="lg" p={6}>
        <CardHeader>
          <Heading size="2xl" color="blue.600">
            {course.title}
          </Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack align="start" spacing={4}>
            <Text fontSize="lg" color="gray.700">
              {course.description}
            </Text>
            <HStack>
              <Tag colorScheme="green" fontSize="md">
                Duration: {course.duration}
              </Tag>
              <Tag colorScheme="purple" fontSize="md">
                Price: KES {course.price}
              </Tag>
            </HStack>
            <Divider />
            <Box>
              <Heading size="md" mb={2}>
                What you'll learn:
              </Heading>
              <Text color="gray.600">{course.content}</Text>
            </Box>
          </VStack>
        </CardBody>
        <CardFooter justifyContent="space-between">
          <Button colorScheme="blue" onClick={() => navigate(-1)}>
            Back to Guide
          </Button>
          <Button
            colorScheme="teal"
            onClick={handlePayment}
            isLoading={paymentLoading}
          >
            Enroll Now
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
}

export default CourseDetails;
