import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import { Action } from "./navigation/Action";
import { ModeToggle } from "./mode-toggle";

const NavBar = async () => {
  // const user = await initialProfile();
  return (
    <div className="row mt-3 ms-4 me-4">
      <div className="col-2 flex gap-2 items-center justify-center bg-white rounded-full cursor-pointer">
        <Image
          src="/images/logo.png"
          alt=""
          className="img-fluid"
          width={50}
          height={50}
        />
        <p className="m-0"> World-Analysis</p>
      </div>
      <div className="col-7"></div>
      <div className="col-1">
        <Action />
      </div>
      <div className="col-1">
        <ModeToggle />
      </div>
      <div className="col-1 flex items-center justify-center gap-2 bg-white rounded-full">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[35px] w-[35px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavBar;
