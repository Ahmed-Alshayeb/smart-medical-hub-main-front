import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const notifications = [
  // Example placeholder notifications
  { id: 1, title: "Appointment Confirmed", message: "Your appointment with Dr. Smith is confirmed for tomorrow at 10:00 AM.", read: false },
  { id: 2, title: "Lab Results Ready", message: "Your recent lab results are now available.", read: true },
  { id: 3, title: "New Message", message: "You have a new message from the hospital.", read: false },
];

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="shadow-xl bg-white/90 dark:bg-gray-900/90 animate-fade-in-up">
          <CardHeader className="flex flex-col items-center gap-2">
            <Bell className="h-10 w-10 text-purple-600 animate-bounce" />
            <CardTitle className="text-2xl font-bold text-center">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No notifications yet.</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-4 rounded-lg shadow flex flex-col gap-1 ${notif.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'}`}>
                  <div className="font-semibold text-lg">{notif.title}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">{notif.message}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications; 