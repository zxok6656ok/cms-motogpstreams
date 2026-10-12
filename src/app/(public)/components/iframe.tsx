type IframeProps = {
  src: string;
};
const Iframe = ({ src }: IframeProps) => {
  return (
    <div className="mx-auto w-full p-0 sm:py-1 m-0  overflow-hidden rounded-none ">
      <iframe
        src={src}
        width="100%"
        height="450"
        allowFullScreen
        className="block h-full w-full p-0 m-0"
      />
    </div>
  );
};

export default Iframe;
