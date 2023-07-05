import React from "react";

const baseStyle = {
  flex: 1,
  display: "flex",
  FlexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function StyledDropzone() {
  // const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } =
  //   useDropzone({
  //     accept: { "image/*": [] },
  //   });
  //
  // const style = useMemo(
  //   () => ({
  //     ...baseStyle,
  //     ...(isFocused ? focusedStyle : {}),
  //     ...(isDragAccept ? acceptStyle : {}),
  //     ...(isDragReject ? rejectStyle : {}),
  //   }),
  //   [isFocused, isDragAccept, isDragReject]
  // );
  // const files = acceptedFiles.map((file) => (
  //   <li key={file.name}>
  //     {file.name} - {file.size} bytes
  //   </li>
  // ));

  return (
    <div className="container">
      {/*<div {...getRootProps({ style })}>*/}
      {/*  <input {...getInputProps()} />*/}
      {/*  <p>Drag drop some files here, or click to select files</p>*/}
      {/*</div>*/}
      {/*<aside>*/}
      {/*  <h4>Files</h4>*/}
      {/*  <ul>{files}</ul>*/}
      {/*</aside>*/}
    </div>
  );
}
