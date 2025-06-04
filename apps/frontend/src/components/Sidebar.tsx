import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

const StyledSidebar = styled(Paper)`
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  background-color: #f5f5f5;
  z-index: 1100; /* Garante que a sidebar fique acima do conteúdo em telas menores */

  @media (max-width: 960px) {
    width: 100%;
    position: static;
    height: auto;
    border-bottom: 1px solid #ddd;
  }
`;

interface Step {
  title: string;
  description: string;
  step: number;
}

interface SidebarProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <StyledSidebar elevation={1}>
      {steps.map((step, index) => (
        <Box
          key={index}
          onClick={() => onStepClick && onStepClick(step.step)}
          sx={{
            mb: 2,
            padding: 2,
            borderRadius: 2,
            backgroundColor: currentStep === step.step ? 'primary.main' : 'grey.100',
            color: currentStep === step.step ? '#fff' : 'inherit',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: currentStep === step.step ? 'primary.dark' : 'grey.200',
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {step.title}
          </Typography>
          <Typography variant="body2">{step.description}</Typography>
        </Box>
      ))}
    </StyledSidebar>
  );
};

export default Sidebar;