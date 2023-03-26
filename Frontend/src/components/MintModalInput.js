import React from "react";
import TextInput from "./base/TextInput";

function MintModalInput({
  setDate,
  setDescription,
  setLocation,
  setFile,
  file,
  message,
  setEventName
}) {
  return (
    <>
      <div>
        <label>Event Name</label>
        <TextInput
          type="text"
          placeholder="Event Name"
          maxLength={50}
          textChange={(e) => setEventName(e.target.value)}
        />
      </div>

      <div>
        <label>Date</label>
        <TextInput
          type="Date"
          placeholder="Description"
          textChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Event-Link</label>
        <TextInput
          type="text"
          placeholder="Live Stream Url"
          maxLength={50}
          textChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div>
        <label>Description</label>
        <TextInput
          type="text"
          placeholder="Description"
          maxLength={100}
          textChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Image</label>
        <div className="search-wrapper">
          <div
            className="search-container"
            style={{
              width: "80%",
              height: "auto",
              background: `radial-gradient(
                    circle,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(48,118,234,0.2) 0%,
                    rgba(255, 255, 255, 0.05) 70%
                )`,
            }}
          >
            <input
              id="search"
              accept="image/*"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
      </div>

      {file != null && (
        <img
          style={{ height: "100px", width: "100px" }}
          src={URL.createObjectURL(file)}
          alt="uploaded file"
        />
      )}

      <h5>{message}</h5>
    </>
    //
  );
}

export default MintModalInput;
