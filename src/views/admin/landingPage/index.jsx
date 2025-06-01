import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Container,
  SimpleGrid,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Divider,
  IconButton,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Progress,
  Avatar,
  AvatarGroup,
  Tooltip,
  keyframes,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AspectRatio
} from '@chakra-ui/react';
import { 
  MdVideoLibrary, 
  MdPeople, 
  MdSpeed, 
  MdAnalytics, 
  MdPlayArrow,
  MdChevronLeft,
  MdChevronRight,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdStar,
  MdCheck,
  MdTrendingUp,
  MdAutorenew,
  MdSecurity,
  MdLanguage,
  MdRequestQuote
} from 'react-icons/md';

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

function LandingPage() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  // Enhanced color scheme with gradients
  const bg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800'); 
  const textColor = useColorModeValue('gray.800', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.300');
  const brandColor = useColorModeValue('blue.500', 'blue.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const footerBg = useColorModeValue('gray.50', 'gray.800');
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.400, purple.500)', 
    'linear(to-r, blue.600, purple.700)'
  );

  // Auto-play demo carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoVideos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats on scroll
  useEffect(() => {
    const handleScroll = () => {
      const statsElement = document.getElementById('stats-section');
      if (statsElement) {
        const rect = statsElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setStatsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to dashboard after sign up
  useEffect(() => {
    if (isSignedIn) {
      navigate('/admin/main-dashboard');
    }
  }, [isSignedIn, navigate]);

  const demoVideos = [
    {
      id: 1,
      title: "AI Voice Cloning in Action",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      description: "Watch AI perfectly clone your voice in minutes",
      duration: "2:45",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
    },
    {
      id: 2,
      title: "Batch Video Generation",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", 
      description: "Generate 1000+ personalized videos instantly",
      duration: "1:30",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
    },
    {
      id: 3,
      title: "Dynamic Personalization",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      description: "See real-time text and image customization",
      duration: "3:15",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
    },
    {
      id: 4,
      title: "Analytics & ROI Tracking",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      description: "Track engagement and conversion metrics",
      duration: "2:20",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
    }
  ];

  const features = [
    {
      icon: MdVideoLibrary,
      title: 'AI Video Personalization',
      description: 'Create thousands of unique videos with dynamic names, company details, and custom messaging.',
      color: 'blue'
    },
    {
      icon: MdAutorenew,
      title: 'Automated Workflows', 
      description: 'Set up campaigns once and let AI handle the rest with smart automation.',
      color: 'green'
    },
    {
      icon: MdSpeed,
      title: 'Lightning-Fast Generation',
      description: 'Generate personalized videos 100x faster than traditional methods.',
      color: 'orange'
    },
    {
      icon: MdAnalytics,
      title: 'Advanced Analytics',
      description: 'Track opens, clicks, watch time, and conversion rates in real-time.',
      color: 'purple'
    },
    {
      icon: MdSecurity,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and SOC2 compliance for your data protection.',
      color: 'red'
    },
    {
      icon: MdLanguage,
      title: 'Multi-Language Support',
      description: 'Create personalized videos in 25+ languages with native pronunciation.',
      color: 'teal'
    }
  ];

  const stats = [
    { label: "Response Rate Increase", value: "340%", icon: MdTrendingUp },
    { label: "Time Saved", value: "95%", icon: MdSpeed },
    { label: "Videos Generated", value: "2M+", icon: MdVideoLibrary },
    { label: "Happy Customers", value: "10K+", icon: MdPeople }
  ];

  const faqs = [
    {
      question: "How realistic is the AI voice cloning?",
      answer: "Our AI voice cloning technology achieves 99.5% similarity to your original voice. Most people can't tell the difference between AI-generated and real speech. We use advanced neural networks trained on millions of voice samples."
    },
    {
      question: "Can I integrate with my existing CRM?",
      answer: "Yes! FlowGen integrates seamlessly with Salesforce, HubSpot, Pipedrive, and 50+ other CRMs through our API. Set up takes less than 5 minutes with our one-click integrations."
    },
    {
      question: "What's the video generation speed?",
      answer: "Individual videos generate in 3-5 seconds. Batch processing can handle 1000+ videos in under 10 minutes. Our enterprise plan includes priority processing for even faster results."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption, are SOC2 compliant, and never store your voice data longer than necessary. All processing happens on secure, isolated servers."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! Start with our 14-day free trial that includes 50 personalized videos, voice cloning setup, and full platform access. No credit card required."
    },
  ];

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demoVideos.length);
  };

  const prevDemo = () => {
    setCurrentDemo((prev) => (prev - 1 + demoVideos.length) % demoVideos.length);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestDemo = () => {
    const subject = encodeURIComponent("Demo Request - FlowGen AI Video Platform");
    const body = encodeURIComponent(`Hi FlowGen Team,

I'm interested in scheduling a demo of your AI video personalization platform. 

Company: [Your Company Name]
Role: [Your Role]
Team Size: [Number of people on your sales/marketing team]
Current Challenge: [Brief description of your current video marketing challenges]

Best times for a demo:
- [Day/Time Option 1]
- [Day/Time Option 2]  
- [Day/Time Option 3]

Looking forward to seeing FlowGen in action!

Best regards,
[Your Name]
[Your Phone Number]`);
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=demo@flowgen.com&su=${subject}&body=${body}`, '_blank');
  };

  const handleWatchDemo = () => {
    onVideoOpen();
  };

  const handleDemoVideoClick = (index) => {
    setCurrentDemo(index);
    onVideoOpen();
  };

  return (
    <Box minH="100vh" bg={bg}>
      {/* Video Demo Modal */}
      <Modal isOpen={isVideoOpen} onClose={onVideoClose} size="4xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
        <ModalContent 
            bg="rgba(255, 255, 255, 0.1)" 
            backdropFilter="blur(20px)"
            borderRadius="2xl" 
            overflow="hidden"
            border="1px solid rgba(255, 255, 255, 0.2)"
        >
            <ModalCloseButton color="white" size="md" />
            <ModalBody p={0}>
            <AspectRatio ratio={16/9}>
                <Box as="iframe"
                src={demoVideos[currentDemo].videoUrl}
                allowFullScreen
                width="100%"
                height="100%"
                frameBorder="0"
                />
            </AspectRatio>
            </ModalBody>
        </ModalContent>
        </Modal>

      {/* Enhanced Header with blur effect */}
      <Box 
        bg={cardBg} 
        backdropFilter="blur(10px)"
        boxShadow="sm" 
        position="sticky" 
        top={0} 
        zIndex={1000}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" py={4}>
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                bg={gradientBg}
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={MdVideoLibrary} color="white" w={6} h={6} />
              </Box>
              <Heading as="h1" size="lg" color={textColor} fontWeight="bold">
                FlowGen
              </Heading>
            </HStack>
            <HStack spacing={4}>
              <Button 
                variant="ghost" 
                color={textColor}
                onClick={scrollToFeatures}
                _hover={{ color: brandColor }}
              >
                Features
              </Button>
              {isSignedIn ? (
                <Button 
                  bgGradient={gradientBg}
                  color="white" 
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  borderRadius="lg"
                  onClick={() => navigate('/admin')}
                  transition="all 0.3s ease"
                >
                  Dashboard
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    bgGradient={gradientBg}
                    color="white" 
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    borderRadius="lg"
                    transition="all 0.3s ease"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Enhanced Hero Section */}
      <Container maxW="7xl" py={20}>
        <Flex align="center" direction={{ base: 'column', lg: 'row' }} spacing={12}>
          <VStack flex={1} align="start" spacing={8} pr={{ lg: 8 }}>
            <HStack>
              <Badge 
                bgGradient={gradientBg}
                color="white"
                px={4} 
                py={2} 
                borderRadius="full"
                fontSize="sm"
                animation={`${pulse} 2s infinite`}
              >
                🚀 AI-Powered Video Revolution
              </Badge>
              <AvatarGroup size="sm" max={3}>
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b72941d1?w=50&h=50&fit=crop&crop=face" />
                <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" />
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" />
              </AvatarGroup>
            </HStack>
            
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight="900"
              color={textColor}
              lineHeight="shorter"
              animation={`${slideIn} 1s ease-out`}
            >
              Scale Video Outreach with
              <Text 
                as="span" 
                bgGradient={gradientBg}
                bgClip="text"
                display="block"
              >
                AI Personalization
              </Text>
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={textColorSecondary}
              lineHeight="tall"
              maxW="500px"
            >
              Create thousands of personalized videos in minutes. Boost response rates by 340% 
              with AI-powered voice cloning and dynamic content generation.
            </Text>

            {/* Social Proof */}
            <HStack spacing={4} pt={2}>
              <HStack>
                <Icon as={MdStar} color="yellow.400" />
                <Text fontWeight="bold" color={textColor}>4.9/5</Text>
                <Text color={textColorSecondary} fontSize="sm">(2,847 reviews)</Text>
              </HStack>
              <Text color={textColorSecondary}>•</Text>
              <Text color={textColorSecondary} fontSize="sm">Trusted by 10,000+ sales teams</Text>
            </HStack>
            
            <HStack spacing={4} pt={4}>
              <Button
                size="lg"
                bgGradient={gradientBg}
                color="white"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                _hover={{ transform: 'translateY(-3px)', boxShadow: 'xl' }}
                transition="all 0.3s ease"
                onClick={handleWatchDemo}
              >
                <Icon as={MdPlayArrow} mr={2} />
                Watch Demo
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                borderColor={brandColor}
                color={brandColor}
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                _hover={{ 
                  bg: brandColor, 
                  color: 'white',
                  transform: 'translateY(-3px)', 
                  boxShadow: 'xl' 
                }}
                transition="all 0.3s ease"
                onClick={handleRequestDemo}
              >
                <Icon as={MdRequestQuote} mr={2} />
                Request Demo
              </Button>
            </HStack>
          </VStack>
          
          <Box flex={1} pl={{ lg: 8 }}>
            <Box
              position="relative"
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="2xl"
              animation={`${float} 6s ease-in-out infinite`}
            >
              <Image
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop"
                alt="FlowGen Dashboard"
                borderRadius="3xl"
              />
              <Box
                position="absolute"
                top={4}
                right={4}
                bg="green.500"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
              >
                🔴 LIVE
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>

      {/* Stats Section */}
      <Box bg={footerBg} py={16} id="stats-section" >
        <Container maxW="6xl">
          <StatGroup>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
              {stats.map((stat, index) => (
                <Stat key={index} textAlign="center">
                  <Box
                    p={4}
                    bg={brandColor}
                    borderRadius="full"
                    display="inline-flex"
                    mb={4}
                  >
                    <Icon as={stat.icon} w={8} h={8} color="white" />
                  </Box>
                  <StatNumber 
                    fontSize="3xl" 
                    fontWeight="bold" 
                    color={textColor}
                    opacity={statsVisible ? 1 : 0}
                    transition="opacity 1s ease-in-out"
                  >
                    {stat.value}
                  </StatNumber>
                  <StatLabel color={textColorSecondary} fontSize="sm">
                    {stat.label}
                  </StatLabel>
                </Stat>
              ))}
            </SimpleGrid>
          </StatGroup>
        </Container>
      </Box>

      {/* Enhanced Demo Section */}
      <Container maxW="6xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize="4xl" fontWeight="bold" color={textColor}>
              See FlowGen in Action
            </Heading>
            <Text fontSize="xl" color={textColorSecondary} maxW="600px">
              Watch real examples of our AI creating personalized videos that get results
            </Text>
          </VStack>

          <Box position="relative" w="full" maxW="700px">
            <Flex align="center" justify="center">
              <IconButton
                icon={<MdChevronLeft />}
                onClick={prevDemo}
                position="absolute"
                left={-16}
                zIndex={2}
                bg={cardBg}
                boxShadow="xl"
                borderRadius="full"
                size="lg"
                _hover={{ bg: 'gray.100', transform: 'scale(1.1)' }}
                transition="all 0.3s ease"
              />
              
              <Box
                bg={cardBg}
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="2xl"
                w="full"
                position="relative"
                border="1px"
                borderColor={borderColor}
                cursor="pointer"
                onClick={() => handleDemoVideoClick(currentDemo)}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.3s ease"
              >
                <Box position="relative" aspectRatio={16/9}>
                  <Image
                    src={demoVideos[currentDemo].thumbnail}
                    alt={demoVideos[currentDemo].title}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconButton
                      icon={<MdPlayArrow />}
                      size="xl"
                      borderRadius="full"
                      bg="whiteAlpha.900"
                      color={brandColor}
                      _hover={{ bg: 'white', transform: 'scale(1.1)' }}
                      transition="all 0.3s ease"
                    />
                  </Box>
                  <Badge
                    position="absolute"
                    top={4}
                    left={4}
                    bg="blackAlpha.700"
                    color="white"
                    borderRadius="md"
                  >
                    {demoVideos[currentDemo].duration}
                  </Badge>
                </Box>
                <Box p={6}>
                  <Heading as="h3" fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
                    {demoVideos[currentDemo].title}
                  </Heading>
                  <Text color={textColorSecondary}>
                    {demoVideos[currentDemo].description}
                  </Text>
                </Box>
              </Box>

              <IconButton
                icon={<MdChevronRight />}
                onClick={nextDemo}
                position="absolute"
                right={-16}
                zIndex={2}
                bg={cardBg}
                boxShadow="xl"
                borderRadius="full"
                size="lg"
                _hover={{ bg: 'gray.100', transform: 'scale(1.1)' }}
                transition="all 0.3s ease"
              />
            </Flex>

            <HStack justify="center" mt={8} spacing={3}>
              {demoVideos.map((_, index) => (
                <Box
                  key={index}
                  w={index === currentDemo ? 8 : 3}
                  h={3}
                  borderRadius="full"
                  bg={index === currentDemo ? brandColor : 'gray.300'}
                  cursor="pointer"
                  onClick={() => setCurrentDemo(index)}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.2)' }}
                />
              ))}
            </HStack>
          </Box>
        </VStack>
      </Container>

      {/* Enhanced Features Section */}
      <Box bg={footerBg} py={20} id="features-section">
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={6} textAlign="center">
              <Badge 
                bgGradient={gradientBg}
                color="white"
                px={4} 
                py={2} 
                borderRadius="full"
                fontSize="sm"
              >
                Powerful Features
              </Badge>
              <Heading as="h2" fontSize="4xl" fontWeight="bold" color={textColor}>
                Everything You Need to Scale
              </Heading>
              <Text fontSize="xl" color={textColorSecondary} maxW="600px">
                From AI voice cloning to advanced analytics, we've got every aspect of video personalization covered
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={8}
                  borderRadius="2xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: 'translateY(-8px)', 
                    boxShadow: '2xl',
                    borderColor: `${feature.color}.200`
                  }}
                  cursor="pointer"
                >
                  <VStack spacing={6} align="start">
                    <Box
                      p={4}
                      bg={`${feature.color}.50`}
                      borderRadius="xl"
                      border="2px"
                      borderColor={`${feature.color}.100`}
                    >
                      <Icon as={feature.icon} w={8} h={8} color={`${feature.color}.500`} />
                    </Box>
                    
                    <VStack spacing={3} align="start">
                      <Heading as="h3" fontSize="lg" fontWeight="bold" color={textColor}>
                        {feature.title}
                      </Heading>
                      
                      <Text color={textColorSecondary} lineHeight="tall">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Enhanced FAQs Section */}
      <Container maxW="4xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize="4xl" fontWeight="bold" color={textColor}>
              Frequently Asked Questions
            </Heading>
            <Text fontSize="xl" color={textColorSecondary}>
              Everything you need to know about FlowGen
            </Text>
          </VStack>

          <Accordion allowToggle w="full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} border="none" mb={4}>
                <AccordionButton
                  bg={cardBg}
                  borderRadius="xl"
                  p={6}
                  _hover={{ bg: 'gray.50' }}
                  boxShadow="md"
                  border="1px"
                  borderColor={borderColor}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold" color={textColor} fontSize="lg">
                      {faq.question}
                    </Text>
                  </Box>
                  <AccordionIcon color={brandColor} />
                </AccordionButton>
                <AccordionPanel pt={6} pb={6} px={6}>
                  <Text color={textColorSecondary} lineHeight="tall" fontSize="md">
                    {faq.answer}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Container>

      {/* Simple Footer */}
      <Box bg={cardBg} borderTop="1px" borderColor={borderColor}>
        <Container maxW="7xl" py={8}>
          <Flex 
            justify="space-between" 
            align="center" 
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
          >
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bgGradient={gradientBg}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={MdVideoLibrary} color="white" w={5} h={5} />
              </Box>
              <Text fontWeight="bold" color={textColor}>
                FlowGen
              </Text>
            </HStack>
            
            <Text color={textColorSecondary} fontSize="sm">
              © 2024 FlowGen Inc. All rights reserved.
            </Text>
            
            <HStack spacing={6}>
              <Link 
                color={textColorSecondary} 
                fontSize="sm"
                _hover={{ color: brandColor }}
              >
                Privacy
              </Link>
              <Link 
                color={textColorSecondary} 
                fontSize="sm"
                _hover={{ color: brandColor }}
              >
                Terms
              </Link>
              <Link 
                href="mailto:hello@flowgen.com"
                color={textColorSecondary} 
                fontSize="sm"
                _hover={{ color: brandColor }}
              >
                Contact
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;