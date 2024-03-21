import "./Button.scss";

export default function Button(
    {
        text,
        isEnable = true,
        handleSuccess,
        type = "submit"
    }
) {
  return (
    <button
      style={{
        background: isEnable ? "#4B7BF5" : "#799df6",
        cursor: isEnable ? "pointer" : "not-allowed",
      }}
      disabled={!isEnable}
      onClick={handleSuccess}
      id="enter__btn"
      type="submit"
    >
      {text}
    </button>
  );
}
