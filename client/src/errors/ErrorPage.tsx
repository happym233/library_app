interface Props {
  message: string;
}

export default function ErrorPage({ message }: Props) {
  return (
    <div className="container m-5">
      <p className="text-center fs-3 fw-semibold text-danger">{message}</p>
    </div>
  );
}
