import "./Stories.css";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Plus,
    Sparkles,
    Clock3,
} from "lucide-react";

import StoryCard
    from "../../components/Stories/StoryCard/StoryCard";

import StoryViewer
    from "../../components/Stories/StoryViewer/StoryViewer";

import CreateStoryModal
    from "../../components/Stories/CreateStoryModal/CreateStoryModal";


/* =========================================================
   CONSTANTS
========================================================= */

const ONE_DAY =
    24 * 60 * 60 * 1000;

const EXPIRY_CHECK_INTERVAL =
    60 * 1000;


/* =========================================================
   DEMO STORIES
========================================================= */

const DEFAULT_STORIES = [

    {
        id: "demo-story-1",

        username: "alex",

        avatar: "",

        type: "image",

        mediaUrl:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",

        caption:
            "Beautiful day ✨",

        viewed: false,

        createdAt:
            Date.now(),

        expiresAt:
            Date.now() + ONE_DAY,
    },


    {
        id: "demo-story-2",

        username: "sarah",

        avatar: "",

        type: "image",

        mediaUrl:
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=85",

        caption:
            "Weekend vibes 🌿",

        viewed: false,

        createdAt:
            Date.now(),

        expiresAt:
            Date.now() + ONE_DAY,
    },


    {
        id: "demo-story-3",

        username: "john",

        avatar: "",

        type: "image",

        mediaUrl:
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85",

        caption:
            "Exploring the world 🌎",

        viewed: true,

        createdAt:
            Date.now(),

        expiresAt:
            Date.now() + ONE_DAY,
    },

];


/* =========================================================
   HELPERS
========================================================= */

const createStoryId = () => {

    return (
        `story-${Date.now()}-` +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );

};


const isExpired = (story) => {

    if (!story?.expiresAt) {
        return false;
    }

    return (
        Date.now() >=
        Number(story.expiresAt)
    );

};


/* =========================================================
   COMPONENT
========================================================= */

function Stories({

    initialStories = null,

    currentUser = {
        username: "devuser",
        avatar: "",
    },

    onStoriesChange,

}) {


    /* =====================================================
       STATE
    ===================================================== */

    const [stories, setStories] =
        useState(() => {

            const source =
                Array.isArray(
                    initialStories
                ) &&
                initialStories.length > 0
                    ? initialStories
                    : DEFAULT_STORIES;


            return source.filter(
                (story) =>
                    !isExpired(story)
            );

        });


    const [viewerOpen, setViewerOpen] =
        useState(false);


    const [viewerIndex, setViewerIndex] =
        useState(0);


    const [createOpen, setCreateOpen] =
        useState(false);


    /* =====================================================
       REMOVE EXPIRED STORIES
    ===================================================== */

    const removeExpiredStories =
        useCallback(() => {

            setStories(
                (previousStories) => {

                    const activeStories =
                        previousStories.filter(
                            (story) =>
                                !isExpired(
                                    story
                                )
                        );


                    if (
                        activeStories.length ===
                        previousStories.length
                    ) {
                        return previousStories;
                    }


                    return activeStories;

                }
            );

        }, []);


    useEffect(() => {

        removeExpiredStories();


        const interval =
            window.setInterval(
                removeExpiredStories,
                EXPIRY_CHECK_INTERVAL
            );


        return () =>
            window.clearInterval(
                interval
            );

    }, [
        removeExpiredStories,
    ]);


    /* =====================================================
       ACTIVE STORIES
    ===================================================== */

    const activeStories =
        useMemo(() => {

            return stories.filter(
                (story) =>
                    !isExpired(story)
            );

        }, [stories]);


    /* =====================================================
       STORY STATS
    ===================================================== */

    const storyStats =
        useMemo(() => {

            const total =
                activeStories.length;


            const viewed =
                activeStories.filter(
                    (story) =>
                        Boolean(
                            story.viewed
                        )
                ).length;


            const unseen =
                total - viewed;


            return {
                total,
                viewed,
                unseen,
            };

        }, [
            activeStories,
        ]);


    /* =====================================================
       EXTERNAL CALLBACK
    ===================================================== */

    useEffect(() => {

        onStoriesChange?.(
            stories
        );

    }, [
        stories,
        onStoriesChange,
    ]);


    /* =====================================================
       CREATE STORY
    ===================================================== */

    const handleCreateStory =
        useCallback(
            (newStory) => {

                if (!newStory) {
                    return;
                }


                const now =
                    Date.now();


                const story = {

                    ...newStory,

                    id:
                        newStory.id ||
                        createStoryId(),

                    username:
                        newStory.username ||
                        currentUser?.username ||
                        "devuser",

                    avatar:
                        newStory.avatar ??
                        currentUser?.avatar ??
                        "",

                    viewed:
                        false,

                    createdAt:
                        newStory.createdAt ||
                        now,

                    expiresAt:
                        newStory.expiresAt ||
                        now + ONE_DAY,

                };


                setStories(
                    (previousStories) => [

                        story,

                        ...previousStories.filter(
                            (item) =>
                                !isExpired(
                                    item
                                )
                        ),

                    ]
                );


                setCreateOpen(false);

            },

            [
                currentUser,
            ]
        );


    /* =====================================================
       OPEN STORY
    ===================================================== */

    const handleOpenStory =
        useCallback(
            (story) => {

                if (!story) {
                    return;
                }


                if (story.isCreate) {

                    setCreateOpen(
                        true
                    );

                    return;
                }


                const index =
                    activeStories.findIndex(
                        (item) =>
                            item.id ===
                            story.id
                    );


                if (index === -1) {
                    return;
                }


                setViewerIndex(index);

                setViewerOpen(true);

            },

            [
                activeStories,
            ]
        );


    /* =====================================================
       VIEWED
    ===================================================== */

    const handleStoryViewed =
        useCallback(
            (storyId) => {

                if (!storyId) {
                    return;
                }


                setStories(
                    (previousStories) =>
                        previousStories.map(
                            (story) =>
                                story.id ===
                                storyId
                                    ? {
                                          ...story,
                                          viewed:
                                              true,
                                      }
                                    : story
                        )
                );

            },
            []
        );


    /* =====================================================
       DELETE STORY
    ===================================================== */

    const handleDeleteStory =
        useCallback(
            (storyId) => {

                if (!storyId) {
                    return;
                }


                setStories(
                    (previousStories) =>
                        previousStories.filter(
                            (story) =>
                                story.id !==
                                storyId
                        )
                );


                setViewerOpen(
                    (previousOpen) =>
                        previousOpen
                );

            },
            []
        );


    /* =====================================================
       CREATE CARD
    ===================================================== */

    const createCard =
        useMemo(
            () => ({

                id:
                    "create-story-card",

                isCreate:
                    true,

                username:
                    "Add Story",

                viewed:
                    true,

            }),
            []
        );


    /* =====================================================
       DISPLAY STORIES
    ===================================================== */

    const displayStories =
        useMemo(
            () => [

                createCard,

                ...activeStories,

            ],
            [
                createCard,
                activeStories,
            ]
        );


    /* =====================================================
       CLOSE VIEWER
    ===================================================== */

    const handleCloseViewer =
        useCallback(() => {

            setViewerOpen(false);

        }, []);


    /* =====================================================
       CLOSE CREATE MODAL
    ===================================================== */

    const handleCloseCreate =
        useCallback(() => {

            setCreateOpen(false);

        }, []);


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <main
            className="
                stories-page
            "
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header
                className="
                    stories-page__header
                "
            >

                <div
                    className="
                        stories-page__heading
                    "
                >

                    <div
                        className="
                            stories-page__icon
                        "
                    >
                        <Sparkles
                            size={19}
                        />
                    </div>


                    <div>

                        <div
                            className="
                                stories-page__title-row
                            "
                        >

                            <h1>
                                Stories
                            </h1>

                            {storyStats.total > 0 && (

                                <span
                                    className="
                                        stories-page__count
                                    "
                                >
                                    {storyStats.total}
                                </span>

                            )}

                        </div>


                        <p>
                            Share moments,
                            memories and
                            everyday life.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="
                        stories-page__add
                    "
                    onClick={() =>
                        setCreateOpen(true)
                    }
                >

                    <Plus
                        size={17}
                    />

                    <span>
                        Add Story
                    </span>

                </button>

            </header>


            {/* =================================================
                STORY INFORMATION BAR
            ================================================= */}

            {storyStats.total > 0 && (

                <div
                    className="
                        stories-page__info
                    "
                >

                    <div
                        className="
                            stories-page__info-left
                        "
                    >

                        <span
                            className="
                                stories-page__status-dot
                            "
                        />

                        <span>
                            {storyStats.unseen > 0
                                ? `${storyStats.unseen} new ${
                                      storyStats.unseen === 1
                                          ? "story"
                                          : "stories"
                                  }`
                                : "All stories viewed"}
                        </span>

                    </div>


                    <div
                        className="
                            stories-page__expiry
                        "
                    >

                        <Clock3
                            size={13}
                        />

                        <span>
                            Stories disappear
                            after 24 hours
                        </span>

                    </div>

                </div>

            )}


            {/* =================================================
                STORIES
            ================================================= */}

            <section
                className="
                    stories-page__section
                "
                aria-label="Stories"
            >

                <div
                    className="
                        stories-page__list
                    "
                >

                    {displayStories.map(
                        (story) => (

                            <StoryCard
                                key={
                                    story.id
                                }
                                story={
                                    story
                                }
                                onOpenStory={
                                    handleOpenStory
                                }
                                onDeleteStory={
                                    handleDeleteStory
                                }
                            />

                        )
                    )}

                </div>

            </section>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {activeStories.length === 0 && (

                <section
                    className="
                        stories-page__empty
                    "
                >

                    <div
                        className="
                            stories-page__empty-glow
                        "
                    />

                    <div
                        className="
                            stories-page__empty-icon
                        "
                    >
                        <Sparkles
                            size={26}
                        />
                    </div>


                    <h2>
                        Nothing here yet
                    </h2>


                    <p>
                        Start sharing your
                        first moment with
                        friends and let your
                        story begin.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            setCreateOpen(true)
                        }
                    >

                        <Plus
                            size={16}
                        />

                        Create Your Story

                    </button>

                </section>

            )}


            {/* =================================================
                CREATE STORY MODAL
            ================================================= */}

            <CreateStoryModal
                open={
                    createOpen
                }
                onClose={
                    handleCloseCreate
                }
                onCreateStory={
                    handleCreateStory
                }
                currentUser={
                    currentUser
                }
            />


            {/* =================================================
                STORY VIEWER
            ================================================= */}

            <StoryViewer
                open={
                    viewerOpen
                }
                stories={
                    activeStories
                }
                initialIndex={
                    viewerIndex
                }
                onClose={
                    handleCloseViewer
                }
                onStoryViewed={
                    handleStoryViewed
                }
            />

        </main>

    );
}


export default Stories;