import "./DocumentPreview.css";

import {
    FileText,
    Download
} from "lucide-react";

import {
    useMemo
} from "react";


function DocumentPreview({
    file
}) {

    // =====================================================
    // FILE CHECK
    // =====================================================

    if (!file) {
        return null;
    }


    // =====================================================
    // FILE INFORMATION
    // =====================================================

    const fileName =
        typeof file === "string"
            ? file.split("/").pop() || "Document"
            : file?.name || "Document";


    const fileType =
        typeof file === "string"
            ? "File"
            : file?.type || "Document";


    // =====================================================
    // FILE SIZE
    // =====================================================

    const fileSize =
        typeof file === "object" &&
        file?.size
            ? file.size
            : 0;


    const formattedSize =
        useMemo(() => {

            if (!fileSize) {
                return "";
            }


            if (fileSize < 1024) {
                return `${fileSize} B`;
            }


            if (fileSize < 1024 * 1024) {

                return `${(
                    fileSize / 1024
                ).toFixed(1)} KB`;

            }


            if (
                fileSize <
                1024 * 1024 * 1024
            ) {

                return `${(
                    fileSize /
                    (1024 * 1024)
                ).toFixed(1)} MB`;

            }


            return `${(
                fileSize /
                (1024 * 1024 * 1024)
            ).toFixed(1)} GB`;

        }, [fileSize]);


    // =====================================================
    // DOWNLOAD
    // =====================================================

    function handleDownload(event) {

        event?.stopPropagation();


        if (!file) {
            return;
        }


        // -------------------------------------------------
        // STRING URL
        // -------------------------------------------------

        if (typeof file === "string") {

            const link =
                document.createElement("a");

            link.href = file;

            link.target = "_blank";

            link.rel = "noopener noreferrer";

            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            return;

        }


        // -------------------------------------------------
        // FILE / BLOB
        // -------------------------------------------------

        if (
            file instanceof File ||
            file instanceof Blob
        ) {

            const url =
                URL.createObjectURL(file);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();


            setTimeout(() => {

                URL.revokeObjectURL(
                    url
                );

            }, 1000);

        }

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="document-preview">


            {/* =================================================
                ICON
            ================================================= */}

            <div className="document-preview-icon">

                <FileText
                    size={22}
                />

            </div>


            {/* =================================================
                INFO
            ================================================= */}

            <div className="document-preview-info">

                <div className="document-preview-name">

                    {fileName}

                </div>


                <div className="document-preview-meta">

                    <span>
                        {fileType}
                    </span>


                    {formattedSize && (

                        <>
                            <span>
                                •
                            </span>

                            <span>
                                {formattedSize}
                            </span>
                        </>

                    )}

                </div>

            </div>


            {/* =================================================
                DOWNLOAD
            ================================================= */}

            <button
                type="button"

                className="document-preview-download"

                onClick={
                    handleDownload
                }

                aria-label="Download document"
            >

                <Download
                    size={18}
                />

            </button>

        </div>

    );

}


export default DocumentPreview;