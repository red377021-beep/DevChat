function ReplyPreview({

  message,

  onClose,

}) {

  if (!message) return null;

  return (

    <div className="reply-preview">

      <div className="reply-info">

        <strong>

          Replying

        </strong>

        <p>

          {message.text}

        </p>

      </div>

      <button
        type="button"
        className="reply-close"
        onClick={onClose}
      >

        ✕

      </button>

    </div>

  );

}

export default ReplyPreview;