import axios from "@/lib/axios";
import React from "react";
import { cookies } from "next/headers";
async function getMessages() {
  try {
    const messages = await axios.get("/messages/get-all");
    console.log(messages);
  } catch (error) {
    console.log(error);
  }
}
console.log(cookies().get("next-auth.session-token"));
async function DashboardPage() {
  const messages = await getMessages();
  return <div>page</div>;
}

export default DashboardPage;
