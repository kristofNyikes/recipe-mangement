import Image from "next/image";

const CloseButton = () => {
  return (
    <Image
      src={"/images/closeIcon.svg"}
      alt="close icon"
      height={20}
      width={20}
    />
  );
};

export default CloseButton;
