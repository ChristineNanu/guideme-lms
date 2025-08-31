import React, { useEffect, useState } from "react";
import { 
  Box, Flex, Text, Button, Progress, VStack, HStack, Icon, Heading, Collapse, SimpleGrid, useColorModeValue 
} from "@chakra-ui/react";
import { 
  FaBook, FaPlay, FaCertificate, FaSignInAlt, FaUserAlt, FaKey, FaLock, FaBell, FaClipboardCheck 
} from "react-icons/fa";

function GuidePage({ username }) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});

  const initialCourses = [
    { title: "React Basics", progress: 40, lessons: ["JSX & Components", "Props & State", "Hooks Intro"] },
    { title: "Python for Beginners", progress: 75, lessons: ["Variables & Data Types", "Loops", "Functions"] },
    { title: "Data Structures", progress: 20, lessons: ["Arrays", "Linked Lists", "Stacks & Queues"] }
  ];

  const moreCourses = [
    { title: "Advanced CSS", progress: 0, lessons: ["Flexbox", "Grid", "Animations"] },
    { title: "Node.js Fundamentals", progress: 0, lessons: ["Modules", "Express.js", "REST APIs"] },
    { title: "Database Essentials", progress: 0, lessons: ["SQL Basics", "Joins", "Normalization"] }
  ];

  const guideSteps = [
    { icon: FaSignInAlt, title: "Sign In", description: "Use your email and password to log in." },
    { icon: FaUserAlt, title: "Update Profile", description: "Ensure your info is correct for personalized recommendations." },
    { icon: FaKey, title: "Enroll Courses", description: "Browse courses and click enroll to start learning." },
    { icon: FaLock, title: "Secure Learning", description: "All your progress is saved privately and securely." }
  ];

  const notifications = [
    { icon: FaBell, text: "Your React Basics course is 40% complete." },
    { icon: FaClipboardCheck, text: "Certificate available for Python for Beginners." }
  ];

  useEffect(() => {
    setTimeout(() => {
      setCourses(initialCourses);
      setLoading(false);
    }, 800);
  }, []);

  const handleLoadMore = () => setCourses(prev => [...prev, ...moreCourses]);
  const toggleCourse = (title) => setExpandedCourses(prev => ({ ...prev, [title]: !prev[title] }));

  const cardBg = useColorModeValue("white", "gray.700");
  const guideBg = useColorModeValue("gray.50", "gray.600");

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={guideBg}>
        <Box
          borderWidth="4px"
          borderColor="blue.500"
          borderRadius="full"
          w={16}
          h={16}
          borderTopColor="transparent"
          style={{ animation: "spin 1s linear infinite" }}
        />
      </Flex>
    );
  }

  return (
    <VStack spacing={10} py={12} px={4} maxW="7xl" mx="auto">
      <Heading size="2xl" textAlign="center">Welcome back, {username || "Learner"}!</Heading>

      {/* Notifications */}
      <VStack spacing={3} w="full">
        {notifications.map((note, idx) => (
          <Flex key={idx} p={4} bg={cardBg} shadow="md" borderLeft="4px solid" borderColor="yellow.400" rounded="xl" align="center">
            <Icon as={note.icon} w={6} h={6} mr={3} />
            <Text fontSize="sm" fontWeight="medium">{note.text}</Text>
          </Flex>
        ))}
      </VStack>

      {/* Courses */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
        {courses.map((course, idx) => (
          <Box key={idx} p={6} bg={cardBg} shadow="lg" rounded="3xl" cursor="pointer">
            <Flex justify="space-between" align="center" mb={4} onClick={() => toggleCourse(course.title)}>
              <HStack>
                <Icon as={FaBook} w={6} h={6} color="blue.500" />
                <Text fontSize="xl" fontWeight="semibold">{course.title}</Text>
              </HStack>
              <Text>{expandedCourses[course.title] ? "▲" : "▼"}</Text>
            </Flex>

            <Progress value={course.progress} colorScheme="blue" size="sm" mb={4} borderRadius="lg" />

            <Collapse in={expandedCourses[course.title]} animateOpacity>
              <VStack align="start" spacing={1} mb={4} pl={4}>
                {course.lessons.map((lesson, lidx) => (
                  <Text key={lidx} fontSize="sm">• {lesson}</Text>
                ))}
              </VStack>
            </Collapse>

            <HStack spacing={3}>
              <Button flex={1} colorScheme="blue" leftIcon={<FaPlay />} onClick={() => alert(`Continue ${course.title}`)}>Continue</Button>
              <Button flex={1} colorScheme="purple" leftIcon={<FaCertificate />} onClick={() => alert(`View Certificate for ${course.title}`)}>Certificate</Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      <Button colorScheme="green" size="lg" rounded="2xl" shadow="md" onClick={handleLoadMore}>Browse More Courses</Button>

      {/* Guide Section */}
      <VStack spacing={6} w="full">
        <Heading size="2xl" textAlign="center" color="blue.600">Quick LMS Guide</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          {guideSteps.map((step, idx) => (
            <Flex key={idx} p={6} bg={guideBg} shadow="md" rounded="3xl" align="start">
              <Icon as={step.icon} w={8} h={8} mr={4} />
              <Box>
                <Text fontWeight="semibold" fontSize="lg">{step.title}</Text>
                <Text fontSize="sm" color="gray.600">{step.description}</Text>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}

export default GuidePage;
