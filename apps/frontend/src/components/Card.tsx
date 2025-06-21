import React from 'react';
import { Card as MuiCard, CardProps, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CustomCardProps extends CardProps {
  hover?: boolean;
  padding?: number;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'hover' && prop !== 'padding',
})<CustomCardProps>(({ theme, hover, padding = 3 }) => ({
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  padding: theme.spacing(padding),
  
  ...(hover && {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
  }),
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}));

const Card: React.FC<CustomCardProps> = ({ 
  children, 
  hover = false, 
  padding = 3,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledCard
      hover={hover}
      padding={isMobile ? 2 : padding}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card; 