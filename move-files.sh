#!/bin/bash

# Create the main component directory structure
mkdir -p app/components/{layout,dashboard,parameters,maintenance,inhabitants,equipment,knowledge,auth,ui}

# Create empty component files (only if they don't exist)
declare -A component_files=(
    ["app/components/layout/MainLayout.tsx"]=""
    ["app/components/layout/Navbar.tsx"]=""
    ["app/components/layout/Header.tsx"]=""
    ["app/components/layout/UserMenu.tsx"]=""
    ["app/components/dashboard/DashboardCard.tsx"]=""
    ["app/components/dashboard/TankOverview.tsx"]=""
    ["app/components/dashboard/QuickActions.tsx"]=""
    ["app/components/parameters/WaterParameterCard.tsx"]=""
    ["app/components/parameters/ParameterChart.tsx"]=""
    ["app/components/parameters/ParameterTable.tsx"]=""
    ["app/components/maintenance/MaintenanceLog.tsx"]=""
    ["app/components/maintenance/MaintenanceSchedule.tsx"]=""
    ["app/components/inhabitants/InhabitantCard.tsx"]=""
    ["app/components/inhabitants/InhabitantList.tsx"]=""
    ["app/components/equipment/EquipmentCard.tsx"]=""
    ["app/components/equipment/EquipmentList.tsx"]=""
    ["app/components/knowledge/KnowledgeArticle.tsx"]=""
    ["app/components/knowledge/SearchableKnowledge.tsx"]=""
    ["app/components/auth/AuthForm.tsx"]=""
    ["app/components/auth/ProtectedRoute.tsx"]=""
    ["app/components/ui/LoadingSpinner.tsx"]=""
    ["app/components/ui/ErrorBoundary.tsx"]=""
    ["app/components/ui/ThemeToggle.tsx"]=""
)

# Create component files
for file in "${!component_files[@]}"; do
    if [ ! -f "$file" ]; then
        mkdir -p "$(dirname "$file")"
        touch "$file"
        echo "Created: $file"
    else
        echo "File already exists: $file"
    fi
done

# Move existing files to their new locations
if [ -f "app/MainLayout.tsx" ]; then
    mv "app/MainLayout.tsx" "app/components/layout/MainLayout.tsx"
    echo "Moved MainLayout.tsx to components/layout/"
fi

if [ -f "app/WaterParameterCard.tsx" ]; then
    mv "app/WaterParameterCard.tsx" "app/components/parameters/WaterParameterCard.tsx"
    echo "Moved WaterParameterCard.tsx to components/parameters/"
fi

# Create directories for data storage utilities
mkdir -p app/lib/{db,api,utils}

# Create API route directories
mkdir -p app/api/{parameters,maintenance,inhabitants,equipment,knowledge}/route.ts

echo "Directory structure setup complete!"
echo "Remember to update your import statements in files that reference the moved components."
