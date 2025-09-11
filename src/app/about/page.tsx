"use client"
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Clock, Heart, Target, Zap } from 'lucide-react';


export default function AboutPage(){
  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Partner Restaurants', icon: Award },
    { number: '25 min', label: 'Average Delivery', icon: Clock },
    { number: '4.9/5', label: 'Customer Rating', icon: Heart }
  ];

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'We partner only with restaurants that meet our high standards for food quality and service excellence.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Our optimized delivery network ensures your food arrives fresh, hot, and right on time.'
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Every decision we make is driven by our commitment to creating amazing experiences for our customers.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6">About FlavorHub</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Connecting Food Lovers with Amazing Flavors
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make exceptional dining experiences accessible to everyone, 
              connecting passionate food lovers with the finest restaurants in their city.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground text-lg mb-6">
                FlavorHub was born from a simple belief: everyone deserves access to exceptional food experiences. 
                What started as a small team of food enthusiasts has grown into a platform that connects thousands 
                of customers with hundreds of amazing restaurants.
              </p>
              <p className="text-muted-foreground text-lg mb-6">
                We work tirelessly to curate only the finest dining establishments, ensuring that every meal 
                delivered through our platform meets the highest standards of quality, taste, and presentation.
              </p>
              <p className="text-muted-foreground text-lg">
                Today, we're proud to be the bridge between food lovers and culinary artists, making it easier 
                than ever to discover and enjoy incredible flavors from the comfort of your home.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-full "
            >
              <div className="aspect-square w-full flex items-center  bg-gradient-to-br from-primary/90 to-secondary/100 rounded-3xl ">
            

                <img
                src={"/assets/hero-restaurant.jpg"}
                alt={"Hero Image"}
                className='object-cover rounded-3xl'
                />
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and drive us to deliver exceptional experiences
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="card-premium h-full text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Join Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're always looking for passionate individuals who share our love for great food and exceptional service. 
              Whether you're a restaurant owner, delivery partner, or want to join our team, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

;