import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Progress,
  VStack,
  HStack,
  Icon,
  Heading,
  Collapse,
  SimpleGrid,
  Divider,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaBook,
  FaPlay,
  FaCertificate,
  FaSignInAlt,
  FaUserAlt,
  FaKey,
  FaLock,
  FaBell,
  FaQuestionCircle,
} from "react-icons/fa";

function GuidePage() {
  const location = useLocation();
  const username = location.state?.username || "Christine";

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [fetched, setFetched] = useState(false); // for courses fetch

  // Profile edit states
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileName, setProfileName] = useState(username);
  const [profileEmail, setProfileEmail] = useState("");

  // Secure Learning states
  const [showSecure, setShowSecure] = useState(false);

  const coursesRef = useRef();

  // Payment modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const fetchCourses = () => {
    if (fetched) return;
    setLoading(true);
    fetch("http://127.0.0.1:5000/courses")
      .then((res) => res.json())
      .then((data) => {
        const colorMap = ["blue.400", "green.400", "purple.400", "pink.400", "orange.400", "teal.400"];
        const fetchedCourses = data.courses.map((c, idx) => ({
          ...c,
          lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
          progress: 0,
          color: colorMap[idx % colorMap.length],
          paid: false,
        }));
        setCourses(fetchedCourses);

        const fetchedNotifications = fetchedCourses
          .filter(c => c.progress > 0)
          .map(c => ({
            icon: FaBell,
            text: `Your ${c.title} course is ${c.progress}% complete.`,
          }));
        setNotifications(fetchedNotifications);

        setLoading(false);
        setFetched(true);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setLoading(false);
      });
  };

  const guideSteps = [
    { icon: FaSignInAlt, title: "Sign In", description: "Use your email and password to log in." },
    { 
      icon: FaUserAlt, 
      title: "Update Profile", 
      description: "Click to edit your name and email.",
      onClick: () => setShowProfileEdit(!showProfileEdit),
    },
    { 
      icon: FaKey, 
      title: "Enroll Courses", 
      description: "Browse courses and click enroll to start learning.",
      onClick: () => {
        coursesRef.current.scrollIntoView({ behavior: "smooth" });
        fetchCourses();
      },
    },
    { 
      icon: FaLock, 
      title: "Secure Learning", 
      description: "All your progress is saved privately and securely.",
      onClick: () => setShowSecure(!showSecure),
    },
  ];

  const toggleCourse = (title) =>
    setExpandedCourses((prev) => ({ ...prev, [title]: !prev[title] }));

  const displayedCourses = showAll ? courses : courses.slice(0, 6);

  const handleProfileSave = () => {
    alert(`Profile updated!\nName: ${profileName}\nEmail: ${profileEmail}`);
    setShowProfileEdit(false);
  };

  const handleCourseContinue = (courseIdx) => {
    const course = courses[courseIdx];
    if (!course.paid) {
      setSelectedCourseIdx(courseIdx);
      onOpen(); // open phone input modal
    } else {
      alert(`Continuing course "${course.title}"`);
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      alert("Phone number required for payment.");
      return;
    }

    const course = courses[selectedCourseIdx];
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // replace with actual user ID
          course_id: course.id,
          phoneNumber,
          amount: 10,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.ResponseCode === "0" || data.success) {
        alert(`STK Push initiated! Check your phone to complete payment for "${course.title}"`);
        const updatedCourses = [...courses];
        updatedCourses[selectedCourseIdx].paid = true;
        setCourses(updatedCourses);
        onClose();
        setPhoneNumber("");
      } else {
        alert(`Payment failed: ${data.errorMessage || "Try again"}`);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Error initiating payment. Try again.");
    }
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
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
    <VStack spacing={12} py={12} px={4} maxW="7xl" mx="auto">

      {/* Welcome Header */}
      <VStack spacing={2}>
        <Heading
          size="2xl"
          bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
          bgClip="text"
          textAlign="center"
        >
          Welcome back, {username}!
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Your personalized learning dashboard
        </Text>
      </VStack>

      {/* Notifications */}
      <VStack w="full" spacing={3}>
        {notifications.map((note, idx) => (
          <Flex
            key={idx}
            p={4}
            bg="yellow.50"
            rounded="xl"
            shadow="md"
            align="center"
            _hover={{ shadow: "xl", transform: "scale(1.02)", transition: "0.2s" }}
          >
            <Icon as={note.icon} w={6} h={6} mr={3} color="yellow.500" />
            <Text fontWeight="medium">{note.text}</Text>
          </Flex>
        ))}
      </VStack>

      {/* Courses Grid */}
      <SimpleGrid ref={coursesRef} columns={{ base: 1, md: 2 }} spacing={8} w="full">
        {displayedCourses.map((course, idx) => (
          <Box
            key={idx}
            p={6}
            bgGradient={`linear(to-br, ${course.color}.100, ${course.color}.200)`}
            rounded="3xl"
            shadow="lg"
            border="1px solid"
            borderColor={`${course.color}.300`}
            cursor="pointer"
            _hover={{
              shadow: "2xl",
              transform: "translateY(-6px)",
              transition: "0.3s",
              borderColor: `${course.color}.500`,
            }}
          >
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full" onClick={() => toggleCourse(course.title)}>
                <HStack>
                  <Icon as={FaBook} w={6} h={6} color={`${course.color}.500`} />
                  <Text fontSize="xl" fontWeight="semibold">{course.title}</Text>
                  {course.progress === 100 && <Badge colorScheme="green">Completed</Badge>}
                  {!course.paid && <Badge colorScheme="red">Pay to Continue</Badge>}
                </HStack>
                <Text fontWeight="bold" color={`${course.color}.500`}>
                  {expandedCourses[course.title] ? "▲" : "▼"}
                </Text>
              </HStack>

              <Progress
                value={course.progress}
                colorScheme={course.color.split(".")[0]}
                size="md"
                borderRadius="full"
                w="full"
              />

              <Collapse in={expandedCourses[course.title]} animateOpacity>
                <VStack align="start" spacing={1} pl={4} mt={2}>
                  {course.lessons.map((lesson, lidx) => (
                    <Text key={lidx} fontSize="sm" color="gray.700">• {lesson}</Text>
                  ))}
                </VStack>
              </Collapse>

              <HStack spacing={3} w="full">
                <Button
                  flex={1}
                  colorScheme={course.color.split(".")[0]}
                  leftIcon={<FaPlay />}
                  onClick={() => handleCourseContinue(idx)}
                >
                  Continue
                </Button>
                <Button
                  flex={1}
                  colorScheme={course.color.split(".")[0]}
                  variant="outline"
                  leftIcon={<FaCertificate />}
                  onClick={() => alert(`View Certificate for ${course.title}`)}
                >
                  Certificate
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {!showAll && courses.length > 6 && (
        <Button
          colorScheme="green"
          size="lg"
          rounded="2xl"
          shadow="md"
          _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
          onClick={() => setShowAll(true)}
        >
          Show More Courses
        </Button>
      )}

      {/* Quick LMS Guide */}
      <VStack spacing={6} w="full">
        <Heading size="xl" textAlign="center" color="blue.600">Quick LMS Guide</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          {guideSteps.map((step, idx) => (
            <Flex
              key={idx}
              p={6}
              bgGradient="linear(to-br, teal.50, cyan.50)"
              rounded="3xl"
              shadow="md"
              align="start"
              border="1px solid"
              borderColor="teal.100"
              _hover={{ shadow: "2xl", transform: "translateY(-3px)", transition: "0.3s", borderColor: "teal.300" }}
              onClick={step.onClick}
            >
              <Icon as={step.icon} w={8} h={8} mr={4} color="teal.400" />
              <Box>
                <Text fontWeight="semibold" fontSize="lg">{step.title}</Text>
                <Text fontSize="sm" color="gray.600">{step.description}</Text>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>

        {/* Profile Edit Form */}
        <Collapse in={showProfileEdit} animateOpacity>
          <Box onClick={(e) => e.stopPropagation()}>
            <VStack spacing={4} mt={4} w="full" maxW="md" p={4} bg="gray.50" rounded="xl" shadow="md">
              <Input 
                placeholder="Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input 
                placeholder="Email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleProfileSave}>Save Profile</Button>
            </VStack>
          </Box>
        </Collapse>

        {/* Secure Learning Panel */}
        <Collapse in={showSecure} animateOpacity>
          <Box onClick={(e) => e.stopPropagation()}>
            <VStack spacing={3} mt={4} p={4} bg="gray.50" rounded="xl" shadow="sm" w="full" maxW="md">
              <Text fontSize="md" fontWeight="semibold">Your learning progress is fully encrypted and private.</Text>
              <Text fontSize="sm" color="gray.600">No one can access your progress without your permission.</Text>
              <Text fontSize="sm" color="gray.600">We use secure protocols and store all data safely.</Text>
              <Button colorScheme="green" size="sm" mt={2} onClick={() => alert("Privacy settings accessed")}>
                Privacy Settings
              </Button>
            </VStack>
          </Box>
        </Collapse>
      </VStack>

      {/* Tips for Success */}
      <VStack w="full" maxW="2xl" bg="blue.50" rounded="2xl" shadow="md" p={6} border="1px solid" borderColor="blue.100">
        <Heading size="md" color="blue.600" mb={2}>Tips for Success</Heading>
        <Divider />
        <VStack align="start" spacing={1} mt={2}>
          <Text>• Set daily learning goals</Text>
          <Text>• Review notes after each lesson</Text>
          <Text>• Ask questions in course forums</Text>
        </VStack>
      </VStack>

      {/* Support Button */}
      <Box w="full" textAlign="center">
        <Button colorScheme="red" variant="outline" leftIcon={<FaQuestionCircle />} onClick={() => window.open("mailto:support@guideme.com")}>
          Need Help? Contact Support
        </Button>
      </Box>

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Phone Number for Payment</ModalHeader>
          <ModalBody>
            <Input
              placeholder="2547XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handlePayment}>Pay</Button>
            <Button variant="ghost" onClick={() => { onClose(); setPhoneNumber(""); }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </VStack>
  );
}

export default GuidePage;
