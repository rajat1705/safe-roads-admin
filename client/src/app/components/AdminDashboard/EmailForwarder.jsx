import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

const EmailForwarder = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendEmail = () => {
    if (!email || !subject || !message) {
      toast({ title: "Error", description: "All fields are required!", variant: "destructive" });
      return;
    }

    // Placeholder for actual email API integration
    console.log("Email Sent To:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);

    toast({ title: "Success", description: "Email forwarded successfully!" });
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Forwarder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Recipient Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <Textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button onClick={handleSendEmail} className="w-full">Send Email</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailForwarder;