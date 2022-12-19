import { Container, ProfileInfo } from "./Navbar.styles";

import Image from "next/image";
import Logo from "@/icons/Logo.svg";
import Menu from "@/icons/MenuDots.svg";
import Settings from "@/icons/Settings.svg";

const Navbar = () => {
  return (
    <Container>
      <Logo width={159} height={56} />
      <ProfileInfo>
        <Settings width={24} height={24} />
        <Menu />
        <Image
          src="https://i.pinimg.com/originals/c0/c2/16/c0c216b3743c6cb9fd67ab7df6b2c330.jpg"
          width={32}
          height={32}
        />
      </ProfileInfo>
    </Container>
  );
};

export default Navbar;
