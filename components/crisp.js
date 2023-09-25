"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("556d6427-2567-4f26-a120-3786eed80663");
  });

  return null;
}

export default CrispChat;