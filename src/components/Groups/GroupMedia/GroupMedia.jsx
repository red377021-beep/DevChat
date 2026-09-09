import "./GroupMedia.css";

import {
    Search,
    Image,
    Video,
    Link2,
    Play,
    ExternalLink,
    Grid3X3,
    List,
    X,
    FileImage,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";


function GroupMedia({
    media = [],
    onMediaClick,
    onLoadMore,
}) {
    const [activeFilter, setActiveFilter] =
        useState("all");

    const [searchQuery, setSearchQuery] =
        useState("");

    const [searchOpen, setSearchOpen] =
        useState(false);

    const [viewMode, setViewMode] =
        useState("grid");


    const filters = [
        {
            id: "all",
            label: "All",
            icon: Grid3X3,
        },
        {
            id: "image",
            label: "Images",
            icon: Image,
        },
        {
            id: "video",
            label: "Videos",
            icon: Video,
        },
        {
            id: "link",
            label: "Links",
            icon: Link2,
        },
    ];


    const demoMedia = [
        {
            id: "media-1",
            type: "image",
            title: "Group Image",
            senderName: "Alex",
            createdAt: "Today",
            url: "",
        },
        {
            id: "media-2",
            type: "video",
            title: "Group Video",
            senderName: "Sarah",
            createdAt: "Yesterday",
            url: "",
        },
        {
            id: "media-3",
            type: "image",
            title: "Shared Photo",
            senderName: "Daniel",
            createdAt: "2 days ago",
            url: "",
        },
        {
            id: "media-4",
            type: "link",
            title: "DevChat Documentation",
            description:
                "Useful development resources",
            senderName: "You",
            createdAt: "3 days ago",
            url: "https://devchat.app",
        },
    ];


    const sourceMedia =
        Array.isArray(media) && media.length > 0
            ? media
            : demoMedia;


    const filteredMedia = useMemo(() => {
        const query =
            searchQuery
                .trim()
                .toLowerCase();


        return sourceMedia.filter((item) => {
            const type =
                String(
                    item?.type || ""
                ).toLowerCase();


            const title =
                String(
                    item?.title || ""
                ).toLowerCase();


            const description =
                String(
                    item?.description || ""
                ).toLowerCase();


            const sender =
                String(
                    item?.senderName || ""
                ).toLowerCase();


            const matchesFilter =
                activeFilter === "all" ||
                type === activeFilter;


            const matchesSearch =
                !query ||
                title.includes(query) ||
                description.includes(query) ||
                sender.includes(query);


            return (
                matchesFilter &&
                matchesSearch
            );
        });

    }, [
        sourceMedia,
        activeFilter,
        searchQuery,
    ]);


    const getTypeIcon = (type) => {
        if (type === "video") {
            return Video;
        }

        if (type === "link") {
            return Link2;
        }

        return Image;
    };


    const getFallbackTitle = (type) => {
        if (type === "video") {
            return "Video";
        }

        if (type === "link") {
            return "Shared Link";
        }

        return "Image";
    };


    const handleMediaClick = (item) => {
        onMediaClick?.(item);
    };


    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
    };


    const handleClearSearch = () => {
        setSearchQuery("");
    };


    const handleClearFilters = () => {
        setSearchQuery("");
        setActiveFilter("all");
    };


    return (
        <section
            className="group-media"
            aria-label="Group media"
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="group-media__header">

                <div className="group-media__heading">

                    <div className="group-media__title-row">

                        <h2>
                            Group Media
                        </h2>

                        <span
                            className="group-media__count"
                            aria-label={`${filteredMedia.length} items`}
                        >
                            {filteredMedia.length}
                        </span>

                    </div>

                    <p>
                        Photos, videos and links
                        shared in this group.
                    </p>

                </div>


                <div className="group-media__actions">

                    <button
                        type="button"
                        className={`group-media__icon-button ${
                            searchOpen
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setSearchOpen(
                                (value) => !value
                            );

                            if (searchOpen) {
                                setSearchQuery("");
                            }
                        }}
                        aria-label={
                            searchOpen
                                ? "Close media search"
                                : "Search media"
                        }
                        aria-pressed={searchOpen}
                        title={
                            searchOpen
                                ? "Close search"
                                : "Search"
                        }
                    >
                        {searchOpen ? (
                            <X size={18} />
                        ) : (
                            <Search size={18} />
                        )}
                    </button>


                    <button
                        type="button"
                        className={`group-media__icon-button ${
                            viewMode === "grid"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setViewMode("grid")
                        }
                        aria-label="Grid view"
                        aria-pressed={
                            viewMode === "grid"
                        }
                        title="Grid view"
                    >
                        <Grid3X3 size={18} />
                    </button>


                    <button
                        type="button"
                        className={`group-media__icon-button ${
                            viewMode === "list"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setViewMode("list")
                        }
                        aria-label="List view"
                        aria-pressed={
                            viewMode === "list"
                        }
                        title="List view"
                    >
                        <List size={18} />
                    </button>

                </div>

            </header>


            {/* =====================================================
                SEARCH
            ===================================================== */}

            {searchOpen && (
                <div className="group-media__search">

                    <Search
                        size={17}
                        aria-hidden="true"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        placeholder="Search group media..."
                        autoFocus
                        aria-label="Search group media"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={
                                handleClearSearch
                            }
                            aria-label="Clear search"
                            title="Clear"
                        >
                            <X size={16} />
                        </button>
                    )}

                </div>
            )}


            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div
                className="group-media__filters"
                role="tablist"
                aria-label="Media filters"
            >

                {filters.map((filter) => {
                    const Icon = filter.icon;

                    const isActive =
                        activeFilter ===
                        filter.id;


                    return (
                        <button
                            key={filter.id}
                            type="button"
                            role="tab"
                            aria-selected={
                                isActive
                            }
                            className={
                                isActive
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleFilterChange(
                                    filter.id
                                )
                            }
                        >
                            <Icon
                                size={16}
                                strokeWidth={2}
                            />

                            <span>
                                {filter.label}
                            </span>

                        </button>
                    );
                })}

            </div>


            {/* =====================================================
                RESULT INFO
            ===================================================== */}

            {(searchQuery.trim() ||
                activeFilter !== "all") && (
                <div className="group-media__result-info">

                    <span>
                        {filteredMedia.length}
                        {" "}
                        {filteredMedia.length === 1
                            ? "item"
                            : "items"}
                        {" "}
                        found
                    </span>

                    {(searchQuery ||
                        activeFilter !== "all") && (
                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear
                        </button>
                    )}

                </div>
            )}


            {/* =====================================================
                CONTENT
            ===================================================== */}

            {filteredMedia.length > 0 ? (

                <div
                    className={`group-media__content ${
                        viewMode === "list"
                            ? "group-media__content--list"
                            : ""
                    }`}
                >

                    {filteredMedia.map(
                        (item, index) => {
                            const type =
                                String(
                                    item?.type ||
                                    "image"
                                ).toLowerCase();


                            const TypeIcon =
                                getTypeIcon(type);


                            const isImage =
                                type === "image";

                            const isVideo =
                                type === "video";

                            const isLink =
                                type === "link";


                            const itemId =
                                item?.id ||
                                `media-${index}`;


                            const title =
                                item?.title ||
                                getFallbackTitle(
                                    type
                                );


                            const previewSource =
                                item?.thumbnail ||
                                item?.url ||
                                "";


                            return (
                                <button
                                    key={itemId}
                                    type="button"
                                    className={`group-media__item ${
                                        isLink
                                            ? "group-media__item--link"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleMediaClick(
                                            item
                                        )
                                    }
                                    aria-label={`Open ${title}`}
                                >

                                    {/* =================================================
                                        PREVIEW
                                    ================================================= */}

                                    {!isLink && (
                                        <div className="group-media__preview">

                                            {previewSource ? (
                                                <img
                                                    src={
                                                        previewSource
                                                    }
                                                    alt={
                                                        title
                                                    }
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="group-media__placeholder">

                                                    <FileImage
                                                        size={30}
                                                        strokeWidth={1.7}
                                                    />

                                                    <span>
                                                        {isVideo
                                                            ? "Video"
                                                            : "Image"}
                                                    </span>

                                                </div>
                                            )}


                                            {isVideo && (
                                                <span className="group-media__play">
                                                    <Play
                                                        size={17}
                                                        fill="currentColor"
                                                        strokeWidth={1.8}
                                                    />
                                                </span>
                                            )}

                                        </div>
                                    )}


                                    {/* =================================================
                                        DETAILS
                                    ================================================= */}

                                    <div className="group-media__details">

                                        <div className="group-media__item-icon">
                                            <TypeIcon
                                                size={17}
                                                strokeWidth={2}
                                            />
                                        </div>


                                        <div className="group-media__item-text">

                                            <strong>
                                                {title}
                                            </strong>


                                            {item?.description && (
                                                <span>
                                                    {
                                                        item.description
                                                    }
                                                </span>
                                            )}


                                            <small>
                                                {item?.senderName ||
                                                    "Unknown"}
                                                {" "}
                                                •{" "}
                                                {item?.createdAt ||
                                                    "Recently"}
                                            </small>

                                        </div>


                                        {isLink && (
                                            <ExternalLink
                                                className="group-media__external"
                                                size={17}
                                                strokeWidth={2}
                                            />
                                        )}

                                    </div>

                                </button>
                            );
                        }
                    )}

                </div>

            ) : (

                /* =====================================================
                   EMPTY
                   ===================================================== */

                <div className="group-media__empty">

                    <div className="group-media__empty-icon">
                        <Image
                            size={30}
                            strokeWidth={1.7}
                        />
                    </div>


                    <h3>
                        No media found
                    </h3>


                    <p>
                        There are no shared items
                        matching your current
                        filter or search.
                    </p>


                    {(searchQuery ||
                        activeFilter !== "all") && (
                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear Filters
                        </button>
                    )}

                </div>
            )}


            {/* =====================================================
                LOAD MORE
            ===================================================== */}

            {filteredMedia.length > 0 &&
                onLoadMore && (
                    <div className="group-media__load-more">

                        <button
                            type="button"
                            onClick={onLoadMore}
                        >
                            Load More
                        </button>

                    </div>
                )}

        </section>
    );
}


export default GroupMedia;