'use client';

import { SimpleGrid, Container, Title } from '@mantine/core';
import { IconThermometer, IconDropletHalfFilled, IconBleachChlorine, IconFlask2Off, IconFlask2 } from '@tabler/icons-react';
import { WaterParameterCard } from '../components/parameters/WaterParameterCard';

type ParameterType = 'temperature' | 'ph' | 'ammonia' | 'nitrite' | 'nitrate';

const BETTA_PARAMETERS: Record<ParameterType, any> = {
  temperature: {
    min: 76,
    max: 82,
    optimal: 78,
    unit: '°F'
  },
  ph: {
    min: 8,
    max: 7,
    optimal: 7.4,
    unit: 'pH'
  },
  ammonia: {
    max: 0.25,
    optimal: 0,
    unit: 'ppm'
  },
  nitrite: {
    max: 0.25,
    optimal: 0,
    unit: 'ppm'
  },
  nitrate: {
    max: 50,
    optimal: 20,
    unit: 'ppm'
  }
};

export default function ParametersPage() {
// In a real app, you'd fetch this data from your API
const currentParameters = {
    temperature: 78.5,
    ph: 7.2,
    ammonia: 0,
    nitrite: 0,
    nitrate: 0
};

const previousParameters = {
    temperature: 77.8,
    ph: 7.0,
    ammonia: 0,
    nitrite: 0,
    nitrate: 0
};

function getParameterStatus(type: ParameterType, value: number) {
    const params = BETTA_PARAMETERS[type];
    if (type === 'temperature') {
    if (value < params.min || value > params.max) return 'critical';
    if (Math.abs(value - params.optimal) > 2) return 'warning';
    return 'good';
    }
    if (type === 'ph') {
    if (value < params.min || value > params.max) return 'critical';
    if (Math.abs(value - params.optimal) > 0.5) return 'warning';
    return 'good';
    }
    // For ammonia and nitrite
    if (value > params.max) return 'critical';
    if (value > 0) return 'warning';
    return 'good';
}

return (
    <Container size="lg" py="xl">
    <Title order={2} mb="lg">Water Parameters</Title>
    
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <WaterParameterCard
        icon={IconThermometer}
        label="Temperature"
        value={currentParameters.temperature.toString()}
        prevValue={previousParameters.temperature.toString()}
        unit={BETTA_PARAMETERS.temperature.unit}
        status={getParameterStatus('temperature', currentParameters.temperature)}
        />
        
        <WaterParameterCard
        icon={IconDropletHalfFilled}
        label="Level"
        unit={BETTA_PARAMETERS.temperature.unit}
        value={currentParameters.ph.toString()}
        prevValue={previousParameters.ph.toString()}
        status={getParameterStatus('ph', currentParameters.ph)}
        />
        
        <WaterParameterCard
        icon={IconBleachChlorine}
        label="Ammonia"
        value={currentParameters.ammonia.toString()}
        prevValue={previousParameters.ammonia.toString()}
        unit={BETTA_PARAMETERS.ammonia.unit}
        status={getParameterStatus('ammonia', currentParameters.ammonia)}
        />
        
        <WaterParameterCard
        icon={IconFlask2Off}
        label="Nitrite"
        value={currentParameters.nitrite.toString()}
        prevValue={previousParameters.nitrite.toString()}
        unit={BETTA_PARAMETERS.nitrite.unit}
        status={getParameterStatus('nitrite', currentParameters.nitrite)}
        />

        <WaterParameterCard
        icon={IconFlask2}
        label="Nitrate"
        value={currentParameters.nitrate.toString()}
        prevValue={previousParameters.nitrate.toString()}
        unit={BETTA_PARAMETERS.nitrate.unit}
        status={getParameterStatus('nitrate', currentParameters.nitrate)}
        />
    </SimpleGrid>
    </Container>
);
}