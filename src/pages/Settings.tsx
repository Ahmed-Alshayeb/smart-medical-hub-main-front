import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import Layout from "@/components/Layout";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";

const Settings = () => {
  const [profile, setProfile] = useState({ 
    name: "Dr. Ali Ebaid", 
    email: "ali.ebaid@medical.com",
    phone: "+20 123 456 7890",
    address: "123 Medical District, Cairo, Egypt",
    birthDate: "1985-03-15",
    gender: "Male",
    specialization: "Cardiology",
    experience: "15 years"
  });
  
  const [notifications, setNotifications] = useState({ 
    email: true, 
    sms: false,
    push: true,
    appointment: true,
    results: true,
    marketing: false
  });
  
  const [password, setPassword] = useState({ 
    current: "", 
    new: "", 
    confirm: "" 
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    loginNotifications: true,
    deviceManagement: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    dataSharing: false,
    analytics: true,
    marketing: false
  });

  const recentSessions = [
    { id: 1, device: "Chrome on Windows", location: "Cairo, Egypt", lastActive: "2 minutes ago", status: "active" },
    { id: 2, device: "Safari on iPhone", location: "Alexandria, Egypt", lastActive: "1 hour ago", status: "active" },
    { id: 3, device: "Firefox on Mac", location: "Giza, Egypt", lastActive: "2 days ago", status: "expired" }
  ];

  const handleProfileSave = (e) => {
    e.preventDefault();
    console.log("Saving profile:", profile);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Changing password:", password);
    setPassword({ current: "", new: "", confirm: "" });
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    console.log("Saving security settings:", security);
  };

  const handlePrivacySave = (e) => {
    e.preventDefault();
    console.log("Saving privacy settings:", privacy);
  };

  const handleExportData = () => {
    console.log("Exporting user data...");
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
  };

  const sections = [
    {
      id: "profile",
      title: "Profile Settings",
      visible: true,
      component: (
        <FormSection title="Personal Information" onSubmit={handleProfileSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={profile.birthDate}
                onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profile.specialization}
                onChange={(e) => setProfile({...profile, specialization: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => setProfile({...profile, experience: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
              />
            </div>
          </div>
        </FormSection>
      )
    },
    {
      id: "notifications",
      title: "Notification Preferences",
      visible: true,
      component: (
        <FormSection title="Notification Settings" onSubmit={() => console.log("Saving notifications")}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={(v) => setNotifications({...notifications, email: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <Switch 
                checked={notifications.sms} 
                onCheckedChange={(v) => setNotifications({...notifications, sms: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={(v) => setNotifications({...notifications, push: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Appointment Reminders</Label>
                <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
              </div>
              <Switch 
                checked={notifications.appointment} 
                onCheckedChange={(v) => setNotifications({...notifications, appointment: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Test Results</Label>
                <p className="text-sm text-gray-500">Notify when test results are ready</p>
              </div>
              <Switch 
                checked={notifications.results} 
                onCheckedChange={(v) => setNotifications({...notifications, results: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Communications</Label>
                <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
              </div>
              <Switch 
                checked={notifications.marketing} 
                onCheckedChange={(v) => setNotifications({...notifications, marketing: v})} 
              />
            </div>
          </div>
        </FormSection>
      )
    },
    {
      id: "security",
      title: "Security Settings",
      visible: true,
      component: (
        <div className="space-y-6">
          <FormSection title="Change Password" onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({...password, current: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({...password, new: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({...password, confirm: e.target.value})}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Security Preferences" onSubmit={handleSecuritySave}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch 
                  checked={security.twoFactor} 
                  onCheckedChange={(v) => setSecurity({...security, twoFactor: v})} 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                </div>
                <Switch 
                  checked={security.loginNotifications} 
                  onCheckedChange={(v) => setSecurity({...security, loginNotifications: v})} 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Device Management</Label>
                  <p className="text-sm text-gray-500">Manage active sessions and devices</p>
                </div>
                <Switch 
                  checked={security.deviceManagement} 
                  onCheckedChange={(v) => setSecurity({...security, deviceManagement: v})} 
                />
              </div>
            </div>
          </FormSection>
        </div>
      )
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      visible: true,
      component: (
        <FormSection title="Privacy Preferences" onSubmit={handlePrivacySave}>
          <div className="space-y-4">
            <div>
              <Label>Profile Visibility</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Sharing</Label>
                <p className="text-sm text-gray-500">Allow sharing of anonymized data for research</p>
              </div>
              <Switch 
                checked={privacy.dataSharing} 
                onCheckedChange={(v) => setPrivacy({...privacy, dataSharing: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics</Label>
                <p className="text-sm text-gray-500">Help improve our service with usage analytics</p>
              </div>
              <Switch 
                checked={privacy.analytics} 
                onCheckedChange={(v) => setPrivacy({...privacy, analytics: v})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Communications</Label>
                <p className="text-sm text-gray-500">Receive promotional content and updates</p>
              </div>
              <Switch 
                checked={privacy.marketing} 
                onCheckedChange={(v) => setPrivacy({...privacy, marketing: v})} 
              />
            </div>
          </div>
        </FormSection>
      )
    },
    {
      id: "sessions",
      title: "Active Sessions",
      visible: true,
      component: (
        <TableSection title="Device Sessions">
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-gray-500">{session.location} • {session.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={session.status === "active" ? "default" : "secondary"}>
                    {session.status}
                  </Badge>
                  {session.status === "active" && (
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TableSection>
      )
    },
    {
      id: "data",
      title: "Data Management",
      visible: true,
      component: (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Data Export & Deletion</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Your Data</p>
                    <p className="text-sm text-gray-500">Download a copy of all your data</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <PageLayout
        title="Settings"
        subtitle="Manage your account preferences and security"
        sections={sections}
        showSearch={false}
        showFilters={false}
        showActions={false}
      />
    </Layout>
  );
};

export default Settings; 