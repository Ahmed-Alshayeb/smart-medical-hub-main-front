import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarSeparator } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import sidebarGroups from "@/lib/sidebarConfig";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showNavigation?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = true,
  showNavigation = true,
  className = ""
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, hasPermission } = useAuth();

  // Filter sidebar groups based on user permissions
  const filteredSidebarGroups = sidebarGroups.map(group => ({
    ...group,
    links: group.links.filter(link => {
      // Check if authentication is required
      if (link.requireAuth && !isAuthenticated) return false;
      
      // Check if admin access is required
      if (link.requireAdmin && !isAdmin) return false;
      
      // Check specific permissions
      if (link.control && !hasPermission(link.control)) return false;
      
      return true;
    })
  })).filter(group => group.links.length > 0); // Remove empty groups

  if (!showSidebar && !showNavigation) {
    return <div className={className}>{children}</div>;
  }

  if (!showSidebar) {
    return (
      <div className={`h-screen w-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${className}`}>
        <main className="flex-1 h-full overflow-y-auto">
          {showNavigation && (
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90">
              <Navigation />
            </div>
          )}
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className={`h-screen w-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${className}`}>
        {/* Sidebar */}
        <Sidebar collapsible="icon" className="bg-white/95 dark:bg-gray-900/95 border-r border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex flex-col h-full justify-between">
            <div>
              <SidebarHeader>
                <div className="flex items-center gap-1 px-1 py-0" />
                <SidebarTrigger className="ml-0" />
              </SidebarHeader>
              {filteredSidebarGroups.map((group, groupIdx) => (
                <SidebarGroup key={group.label} className="p-0 m-0">
                  <SidebarGroupLabel className="px-1 py-0 leading-tight">{group.label}</SidebarGroupLabel>
                  <SidebarMenu className="gap-0 p-0 m-0">
                    {group.links.map(link => (
                      <SidebarMenuButton
                        key={link.path}
                        isActive={location.pathname === link.path}
                        onClick={() => navigate(link.path)}
                        tooltip={link.label}
                        className="py-0.5 px-1 min-h-0 leading-tight"
                      >
                        <span className="relative inline-block w-5 h-5 mr-2 fade-icon-right">
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </SidebarMenuButton>
                    ))}
                  </SidebarMenu>
                  {groupIdx !== filteredSidebarGroups.length - 1 && <SidebarSeparator className="my-0" />}
                </SidebarGroup>
              ))}
            </div>
            <SidebarFooter className="p-0 m-0" />
          </div>
        </Sidebar>
        
        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto">
          {showNavigation && (
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90">
              <Navigation />
            </div>
          )}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout; 