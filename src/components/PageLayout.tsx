import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  RefreshCw,
  Settings,
  HelpCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Types for configuration
export interface PageSection {
  id: string;
  title: string;
  visible: boolean;
  component: React.ReactNode;
  actions?: React.ReactNode;
}

export interface PageLayoutProps {
  title: string;
  subtitle?: string;
  sections: PageSection[];
  showSearch?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Reusable Stats Section Component
export const StatsSection: React.FC<{
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
    unit?: string;
  }>;
  columns?: number;
  className?: string;
}> = ({ stats, columns = 4, className = "" }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-6 ${className}`}>
    {stats.map((stat, idx) => (
      <Card key={stat.label} className="flex flex-row items-center gap-4 p-4 shadow-md bg-white/90 dark:bg-gray-900/90 animate-fade-in">
        {stat.icon && <div className={stat.color}>{stat.icon}</div>}
        <div>
          <div className="text-2xl font-bold">
            {stat.value}
            {stat.unit && <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>}
          </div>
          <div className="text-gray-600 text-sm">{stat.label}</div>
        </div>
      </Card>
    ))}
  </div>
);

// Reusable Table Section Component
export const TableSection: React.FC<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, children, actions, className = "" }) => (
  <Card className={`shadow-lg bg-white/90 dark:bg-gray-900/90 animate-fade-in ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{title}</CardTitle>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Reusable Form Section Component
export const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  className?: string;
}> = ({ title, children, onSubmit, submitLabel = "Save", className = "" }) => (
  <Card className={`shadow-xl ${className}`}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        {onSubmit && (
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        )}
      </form>
    </CardContent>
  </Card>
);

// Main PageLayout Component
const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  sections,
  showSearch = false,
  showFilters = false,
  showActions = true,
  searchPlaceholder = "Search...",
  onSearch,
  onRefresh,
  onExport,
  loading = false,
  className = "",
  children
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [visibleSections, setVisibleSections] = React.useState(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: section.visible }), {})
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const toggleSection = (sectionId: string) => {
    setVisibleSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const filteredSections = sections.filter(section => visibleSections[section.id]);

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 min-h-[calc(100vh-4rem)] ${className}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Section Visibility Toggle */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allVisible = Object.values(visibleSections).every(v => v);
                  const newState = sections.reduce((acc, section) => ({
                    ...acc,
                    [section.id]: !allVisible
                  }), {});
                  setVisibleSections(newState);
                }}
              >
                {Object.values(visibleSections).every(v => v) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {Object.values(visibleSections).every(v => v) ? "Hide all sections" : "Show all sections"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Search and Filters Bar */}
      {(showSearch || showFilters || showActions) && (
        <Card className="shadow-md bg-white/90 dark:bg-gray-900/90">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {showSearch && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              
              {showFilters && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              )}
              
              {showActions && (
                <div className="flex items-center gap-2">
                  {onRefresh && (
                    <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  )}
                  {onExport && (
                    <Button variant="outline" size="sm" onClick={onExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Visibility Controls */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Tooltip key={section.id}>
            <TooltipTrigger asChild>
              <Button
                variant={visibleSections[section.id] ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSection(section.id)}
              >
                {visibleSections[section.id] ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {section.title}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {visibleSections[section.id] ? `Hide ${section.title}` : `Show ${section.title}`}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {/* Page Content */}
      {!loading && (
        <>
          {/* Dynamic Sections */}
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <div key={section.id}>
                {section.component}
              </div>
            ))}
          </div>

          {/* Custom Children */}
          {children}
        </>
      )}
    </div>
  );
};

export default PageLayout; 