import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Loader2, RefreshCw, Clock, Sparkles } from 'lucide-react';

// Define types for component props
interface LoadingSpinnerProps {
  variant?: 'spinner' | 'pulse' | 'rotate' | 'bounce' | 'shimmer' | 'bars';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'spinner',
  size = 'medium',
  color = '#3b82f6',
  className = ''
}) => {
  // Size mapping
  const sizeMap: Record<string, number> = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  const iconSize = sizeMap[size];
  
  // Variant configurations
  const variants: Record<string, {
    icon?: React.ReactNode;
    animation: MotionProps;
    customComponent?: React.ReactNode;
  }> = {
    spinner: {
      icon: <Loader2 size={iconSize} />,
      animation: {
        animate: {
          rotate: 360,
        },
        transition: {
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }
        }
      }
    },
    pulse: {
      icon: <div style={{
        width: iconSize,
        height: iconSize,
        borderRadius: '50%',
        backgroundColor: color
      }} />,
      animation: {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    rotate: {
      icon: <RefreshCw size={iconSize} />,
      animation: {
        animate: {
          rotate: 360,
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    bounce: {
      icon: <Clock size={iconSize} />,
      animation: {
        animate: {
          y: [0, -8, 0],
        },
        transition: {
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    shimmer: {
      icon: <Sparkles size={iconSize} />,
      animation: {
        animate: {
          scale: [1, 1.3, 1],
          rotate: [0, 15, -15, 0],
        },
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    bars: {
      animation: {
        transition: { staggerChildren: 0.2 }
      },
      customComponent: (
        <div style={{ display: 'flex', alignItems: 'center', height: iconSize, gap: iconSize / 8 }}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{
                width: iconSize / 4,
                height: iconSize/1.5,
                backgroundColor: color,
                borderRadius: 2
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )
    }
  };
  
  const selectedVariant = variants[variant] || variants.spinner;
  
  if (selectedVariant.customComponent) {
    return (
      <motion.div 
        className={className}
        {...selectedVariant.animation}
        style={{ display: 'inline-flex', color }}
      >
        {selectedVariant.customComponent}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={className}
      {...selectedVariant.animation}
      style={{ display: 'inline-flex', color }}
    >
      {selectedVariant.icon}
    </motion.div>
  );
};

export default LoadingSpinner;