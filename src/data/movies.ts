export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  voteCount: number;
  popularity: number;
  releaseYear: number;
  releaseDate: string;
  duration: number;
  director: string;
  genres: string[];
  language: string;
  isCustom?: boolean;
  youtubeId?: string;
}

export const PRE_SEEDED_MOVIES: Movie[] = [
  {
    id: "chronos-unbound",
    title: "Chronos Unbound",
    tagline: "Now Playing in 8K Atmos • Directorial Cut",
    overview: "A haunting visual odyssey through the fractured memory of Earth's final architect. As the physical world dissolves into luminous geometry, he must construct a digital sanctuary before the last frame of reality fades to black.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ZsuHDn9judDbF1F5zMiwEF37HcSaMJ1n28Tl2eitzvu_Jk8yj1OITflJ5kpqVaTrrwZTFega9PXP0ykQ8V2SciHNvrYh8HgOY_P2KH6nWwbL9Bja9ehK3TmVym9iPcvN9cv_Isr0jfO6aOxwAKy0OXPPPSBR116zay73geOX0pj6iLHt6O_Wvg7MgU-uXpUX3fhvsgITTB1xlwLtSOR_DZVFOv2RLo291GylYg9t9h8TFhcePi7PzvipQr6DFQCpTe16ujHOh9eb",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbH5LpvqOcglKvE2k3hBFPSH8UL-Ojuamoe_g06SaTGpXZMuu0gI6_EXG5FzEELpGt-CEixk7jsDak1HrCwb8q22D9635KoNOLlehzBsmMuVuGT1wnf-IvNwPv_Z1nan1IXLge4Jk5UURjwInGzW_XpQS9PFzyJo0yfFkQPyVxeWf8HaeC5ieUyZa7kck1LCPnACfWf4OcgBXydUEn6WoLEeJvEx_APu-TGu3MMhyz3pg7dalleubDjdNolBS_alYEs2HKkfnI_FTG",
    rating: 4.8,
    voteCount: 1240,
    popularity: 98.4,
    releaseYear: 2024,
    releaseDate: "Dec 18, 2024",
    duration: 164,
    director: "Julian Vault",
    genres: ["Sci-Fi", "Mystery", "Noir"],
    language: "English"
  },
  {
    id: "eternity-beyond",
    title: "Eternity Beyond",
    tagline: "A CineVault Original Masterpiece",
    overview: "Step into a world where memory is the only currency that matters. A masterpiece of atmospheric suspense, capturing dense, rollable mist between skyscrapers of a futuristic neo-noir city.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ZmqtBshA6GXdvcKSCdWlmPNS_3AW1fhBZwVdzdJDJ1A17dvrNhoSkjisvBIb6bRZRBSv_3AmJTxcf96RE2XljsfIXxko1oHBQ8PkH39-4vZeWB3xUAyXcxDU3dD1pxjTxTkWaljlX0yPqzRyd2m8IhCV6OLYhyU5owp91ECE9jSYeIN4qQ3fk2BDfxG101nUqvl-KKkrlK86xcOCqL1PZN5JcIKfcQ1JZJ4zEPsK-CgYhtN3B8vFDOzo1-mGpv1DN-PEFFXBjP-",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXt_oAs-N6x_9oXKicEC46IRd1LlKTZs4WabFxqyBFxfc-WVZNSNTuO4lPmtARX_gRT3b508U2nv3hPlhuQMC6H-DIDcXwZUkt3WaEBL2HIYRKK9Wjj_3ancChOKNR3t74BkwETk_l8f_A0AXkgGIkmwwkEnTJQbgGGkbbvdZ9UiDqTSNDnumjRw4b3uaDg6Us-NE884M002i2mMA6Q3cOHVtGYR4Bt16FNdy1eF6n96d5m23Wvd5ed8w_8LW0FYbM95pBhbpr8sTp",
    rating: 4.9,
    voteCount: 3102,
    popularity: 99.2,
    releaseYear: 2024,
    releaseDate: "Nov 02, 2024",
    duration: 152,
    director: "Elena Voss",
    genres: ["Thriller", "Drama", "Sci-Fi"],
    language: "English"
  },
  {
    id: "nocturnal-syndicate",
    title: "Nocturnal Syndicate",
    tagline: "Shadows of a Digital Uprising",
    overview: "A masterclass in atmospheric suspense, tracing the shadows of a digital uprising in the heart of Neo-Berlin with rain-slicked neon crimson fog.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ZmqtBshA6GXdvcKSCdWlmPNS_3AW1fhBZwVdzdJDJ1A17dvrNhoSkjisvBIb6bRZRBSv_3AmJTxcf96RE2XljsfIXxko1oHBQ8PkH39-4vZeWB3xUAyXcxDU3dD1pxjTxTkWaljlX0yPqzRyd2m8IhCV6OLYhyU5owp91ECE9jSYeIN4qQ3fk2BDfxG101nUqvl-KKkrlK86xcOCqL1PZN5JcIKfcQ1JZJ4zEPsK-CgYhtN3B8vFDOzo1-mGpv1DN-PEFFXBjP-",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtls0BKwHQzR7zDpVz4FYg0n2iGdf1olTarsWBcbYWW63ImmD-_XH_zD4TOpPmYYrdezHvCUhona8SEqLLn_s6_vxTDM4e4XKKeALnY0W3OAyTrzbBoGlR3pvgUsj3DMaJMdOAssUGxTkT0FdkKJK6E5cEmHjGEldK-9yCfWuoPhkzd4QnlVimcLlTWGmihR7DhhlC-H22EJynEaBxRsmxtIJRlX4q1rjrLoScQMEY--pC_GFwTu4ef13oOuRYWcJkfHbuUH3O8_Cr",
    rating: 4.7,
    voteCount: 890,
    popularity: 91.1,
    releaseYear: 2023,
    releaseDate: "Oct 15, 2023",
    duration: 138,
    director: "Lukas Vance",
    genres: ["Cyberpunk", "Action", "Mystery"],
    language: "German"
  },
  {
    id: "the-silence-of-stone",
    title: "The Silence of Stone",
    tagline: "An Exploration of Urban Isolation",
    overview: "A lone silhouette stands in a golden glowing architectural tunnel. An intensive study on the echoes we leave behind in the stark brutalist spaces of the future.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw0td5qtoiicY98V2S_g5L75WlFywuioG9ULbHvN2VTjVchh2p9dZfF3leM1YYOvy4SnZRrP3wdDCwyNdzQb0L6nMLHko8sjN-qr6COHTTZ0d8oWgd_dxJ87Ay8wnBPJvXddH4N72_lfnIf2124HNC_xGlVeWxqewW_fFEmMh3PVb5qpygafxKJuFcYzZjejELMPxkIXVVU8uWiX2CZKa52ksn2KNmVfC6D0rzQQgem_irg2oRWq5DYO3WNY_fSzFF-gFRE6_7KAXl",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw0td5qtoiicY98V2S_g5L75WlFywuioG9ULbHvN2VTjVchh2p9dZfF3leM1YYOvy4SnZRrP3wdDCwyNdzQb0L6nMLHko8sjN-qr6COHTTZ0d8oWgd_dxJ87Ay8wnBPJvXddH4N72_lfnIf2124HNC_xGlVeWxqewW_fFEmMh3PVb5qpygafxKJuFcYzZjejELMPxkIXVVU8uWiX2CZKa52ksn2KNmVfC6D0rzQQgem_irg2oRWq5DYO3WNY_fSzFF-gFRE6_7KAXl",
    rating: 4.6,
    voteCount: 1420,
    popularity: 88.5,
    releaseYear: 2024,
    releaseDate: "Jan 22, 2024",
    duration: 110,
    director: "Tadao Kōbo",
    genres: ["Minimalist", "Drama", "Art House"],
    language: "Japanese"
  },
  {
    id: "the-crimson-silence",
    title: "The Crimson Silence",
    tagline: "Stand Against the Desert Moon",
    overview: "An editorial style odyssey featuring a single figure in a high-fashion crimson cloak standing against a vast obsidian desert under a blood-red moon.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ZmqtBshA6GXdvcKSCdWlmPNS_3AW1fhBZwVdzdJDJ1A17dvrNhoSkjisvBIb6bRZRBSv_3AmJTxcf96RE2XljsfIXxko1oHBQ8PkH39-4vZeWB3xUAyXcxDU3dD1pxjTxTkWaljlX0yPqzRyd2m8IhCV6OLYhyU5owp91ECE9jSYeIN4qQ3fk2BDfxG101nUqvl-KKkrlK86xcOCqL1PZN5JcIKfcQ1JZJ4zEPsK-CgYhtN3B8vFDOzo1-mGpv1DN-PEFFXBjP-",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ZmqtBshA6GXdvcKSCdWlmPNS_3AW1fhBZwVdzdJDJ1A17dvrNhoSkjisvBIb6bRZRBSv_3AmJTxcf96RE2XljsfIXxko1oHBQ8PkH39-4vZeWB3xUAyXcxDU3dD1pxjTxTkWaljlX0yPqzRyd2m8IhCV6OLYhyU5owp91ECE9jSYeIN4qQ3fk2BDfxG101nUqvl-KKkrlK86xcOCqL1PZN5JcIKfcQ1JZJ4zEPsK-CgYhtN3B8vFDOzo1-mGpv1DN-PEFFXBjP-",
    rating: 4.5,
    voteCount: 520,
    popularity: 76.8,
    releaseYear: 2024,
    releaseDate: "Feb 10, 2024",
    duration: 135,
    director: "Sarah Lind",
    genres: ["Drama", "Indie", "Fantasy"],
    language: "English"
  },
  {
    id: "techno-lens",
    title: "Techno Lens",
    tagline: "The Reflection of Reality",
    overview: "A comprehensive deep-dive documentary exploring the analog-to-digital shift through the reflection of neon-lit streets inside camera lenses.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaxTWSkq_o7Rqm1kx6ZNOg77RJ7MbgjhQJa7yVNKCqK6BYBQCdMjuocHHSa9fyETlvoM_kqpQ0_EVIApjDMnsf6-rYEChUMoZi3zxsVn2XDCr2kJTGjvPZMdZ2OtFI0-QbmxTr7q-lZCEN9w2_6g7avP6sIql-O3M-zVhIpBZOjNxYoUCcgl-0S5Ah6zQKSC0aRQTZ91BInrUDCItKwZ_EXrg4VpNfR6PIUNppRWRHdWIwvkrwbkRIdg7W-oLiwFIQ4f21HxJfrsq-",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaxTWSkq_o7Rqm1kx6ZNOg77RJ7MbgjhQJa7yVNKCqK6BYBQCdMjuocHHSa9fyETlvoM_kqpQ0_EVIApjDMnsf6-rYEChUMoZi3zxsVn2XDCr2kJTGjvPZMdZ2OtFI0-QbmxTr7q-lZCEN9w2_6g7avP6sIql-O3M-zVhIpBZOjNxYoUCcgl-0S5Ah6zQKSC0aRQTZ91BInrUDCItKwZ_EXrg4VpNfR6PIUNppRWRHdWIwvkrwbkRIdg7W-oLiwFIQ4f21HxJfrsq-",
    rating: 4.4,
    voteCount: 412,
    popularity: 82.3,
    releaseYear: 2023,
    releaseDate: "Sep 05, 2023",
    duration: 94,
    director: "Gabe Sterling",
    genres: ["Documentary", "Tech", "Cinematography"],
    language: "English"
  },
  {
    id: "veils-of-void",
    title: "Veils of Void",
    tagline: "An Anthology of Nothingness",
    overview: "Flowing red silk in an infinite black void becomes an abstract playground for this beautiful, sensory short film that probes the margins of silence.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbmqBOuAvSw7KF43MStbiD78eSobRe5jsU-widSqcfEuj4olTEgW0bu0X5SoAiYFgh0cjCG-sXwBcKKK21TbUmUJCgKNbjkVSdp8rKpaTaY9oTLliIgE4MV_2yw5qEyjmUVQGnG2WIF55_pm5P9u6HOQ_hZXzGgp_2TjU4RsvSFrgXxbmsZvQp5QzIVHtioCDEPfbJQSGVic6QBEQ952ho2Yup4l5w5fGxLCsWjVcv2-hgSCAf9iElmSDKc7Qe5A4WPpk5eR6pNu8s",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbmqBOuAvSw7KF43MStbiD78eSobRe5jsU-widSqcfEuj4olTEgW0bu0X5SoAiYFgh0cjCG-sXwBcKKK21TbUmUJCgKNbjkVSdp8rKpaTaY9oTLliIgE4MV_2yw5qEyjmUVQGnG2WIF55_pm5P9u6HOQ_hZXzGgp_2TjU4RsvSFrgXxbmsZvQp5QzIVHtioCDEPfbJQSGVic6QBEQ952ho2Yup4l5w5fGxLCsWjVcv2-hgSCAf9iElmSDKc7Qe5A4WPpk5eR6pNu8s",
    rating: 4.3,
    voteCount: 230,
    popularity: 64.9,
    releaseYear: 2024,
    releaseDate: "Mar 12, 2024",
    duration: 45,
    director: "Claire De Lune",
    genres: ["Experimental", "Art", "Visuals"],
    language: "French"
  },
  {
    id: "system-override",
    title: "System Override",
    tagline: "Glitch in the Consciousness",
    overview: "A mind-bending cyber-noir thriller following a security analyst who discovers digital interference embedding itself into his biological memories.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0-yE6ZWJw6gZOlwUQaP-aAC-XCB0wKVUxSqOJ1r07fW5tLXXakdKgazbnpZAb7-XxIq-ZihYu1RDsWlvcX-cMEIt6kz_FWmEeR2qH1OFYHv2cP7CCqL4KYuXDHqD2BLgYDra0d8957LXxyNkWrLJ5kfl-_9TrJlar7LFuiG9fFShPydyMDK7nUgeIAy9-ckwsPkLKujHvDu6Qh_8dxn1ff3iGJiAghUy_m40E3M0igw_CF_vLZtqW__OLSIGdaF3fpCxVpVl09QgO",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0-yE6ZWJw6gZOlwUQaP-aAC-XCB0wKVUxSqOJ1r07fW5tLXXakdKgazbnpZAb7-XxIq-ZihYu1RDsWlvcX-cMEIt6kz_FWmEeR2qH1OFYHv2cP7CCqL4KYuXDHqD2BLgYDra0d8957LXxyNkWrLJ5kfl-_9TrJlar7LFuiG9fFShPydyMDK7nUgeIAy9-ckwsPkLKujHvDu6Qh_8dxn1ff3iGJiAghUy_m40E3M0igw_CF_vLZtqW__OLSIGdaF3fpCxVpVl09QgO",
    rating: 4.7,
    voteCount: 940,
    popularity: 94.7,
    releaseYear: 2024,
    releaseDate: "May 20, 2024",
    duration: 118,
    director: "Kenji Sato",
    genres: ["Cyberpunk", "Thriller", "Mind-Bend"],
    language: "Japanese"
  },
  {
    id: "the-neon-desert",
    title: "The Neon Desert",
    tagline: "Where Crystals Hold the Sky",
    overview: "An atmospheric masterpiece capturing cinematographers filming massive glowing crystalline structures on a vast soundstage under amber and blue lighting.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7SiCtxRZWx2NhG0A_zK2yIZkxS0V6IwX709z-sBBzoA_BxyrGz7Eo5EjvTyfkMVcRz9enABFhxdBopvSVwNKnnyjiCpHEFvnob8Gmy760miDQN2-MnXuaz5FQ9Sj9MhpnZIivf2xf1rst6EEm7o1F3QKJgLg2AlhW9dV31Xvx6fVsIJikP46xKqMen1FnhAklvzhwfcunQFv_c_43umE1PouN0POPY5j5Qhq5xNbgwggBzLVQONBJa7n60n3klFdkyfrk-emNMzjV",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7SiCtxRZWx2NhG0A_zK2yIZkxS0V6IwX709z-sBBzoA_BxyrGz7Eo5EjvTyfkMVcRz9enABFhxdBopvSVwNKnnyjiCpHEFvnob8Gmy760miDQN2-MnXuaz5FQ9Sj9MhpnZIivf2xf1rst6EEm7o1F3QKJgLg2AlhW9dV31Xvx6fVsIJikP46xKqMen1FnhAklvzhwfcunQFv_c_43umE1PouN0POPY5j5Qhq5xNbgwggBzLVQONBJa7n60n3klFdkyfrk-emNMzjV",
    rating: 4.6,
    voteCount: 654,
    popularity: 85.1,
    releaseYear: 2024,
    releaseDate: "Apr 05, 2024",
    duration: 124,
    director: "Julian Vault",
    genres: ["Sci-Fi", "Cinematic", "Art House"],
    language: "English"
  },
  {
    id: "velvet-shadows",
    title: "Velvet Shadows",
    tagline: "Echoes of the Golden Screen",
    overview: "Interior of an opulent, empty 1920s cinema hall with deep red velvet seats. A projectionist's light beam cuts through the darkness, inviting lost souls to remember.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0baRL35aCR_WDXO0f2jXMRZtQg1vjhmXYO6P00xBNUk7GM-3iPVsvPTTifr-dWgJVd9x_oTBKqxqOiVjbAJRMjtA4POq_BIHuqLAPjxFl2wquzBZ1U6wvbIQxL4WS6ZJbL-1Utd4dMdu79axsXZOOgB3OZEd35fpCnGq9vQgpybUtC0xM849bkh8Uc7-JCmLkr88WeNDxcXwyIf6YSCuWeoYAvqmGDM19DKograXE-PIc9kw2O8e1xrIRQhL1iJr7LnA-JZwRd80G",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0baRL35aCR_WDXO0f2jXMRZtQg1vjhmXYO6P00xBNUk7GM-3iPVsvPTTifr-dWgJVd9x_oTBKqxqOiVjbAJRMjtA4POq_BIHuqLAPjxFl2wquzBZ1U6wvbIQxL4WS6ZJbL-1Utd4dMdu79axsXZOOgB3OZEd35fpCnGq9vQgpybUtC0xM849bkh8Uc7-JCmLkr88WeNDxcXwyIf6YSCuWeoYAvqmGDM19DKograXE-PIc9kw2O8e1xrIRQhL1iJr7LnA-JZwRd80G",
    rating: 4.5,
    voteCount: 380,
    popularity: 70.4,
    releaseYear: 2024,
    releaseDate: "Jun 14, 2024",
    duration: 105,
    director: "Elena Voss",
    genres: ["Historical", "Poetic", "Drama"],
    language: "English"
  },
  {
    id: "cinematheque",
    title: "Cinematheque",
    tagline: "The Spinning Reels of Time",
    overview: "Macro photography of a spinning film reel, capturing silver edges reflecting shards of light, dark moody backgrounds, and high-fidelity production values.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn20oUMuEJSy36An5Zy7ywvhdRzUHHo0nUQT1gbxC9yoaOIlllQ5rW58yukMhVH9FJZquT9nsOR2YNkm7YRfhC1IOc-kEuifIAq563kOZ2ikvu80A5ftnUPwofQbxsNEEqOKvGJ2y_hiNS7pz38kG-DYwaf8EbsIOCtNu0bN8lmine5jkGMmjk7TuoJsIW5S8MkEoasZlDFkCNEVnzoqvVi1JuQiC7lejdqsuC4FWjfmOsAS6lPCr_30sRuaKKqRU-qCDJ2rpGEkA4",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn20oUMuEJSy36An5Zy7ywvhdRzUHHo0nUQT1gbxC9yoaOIlllQ5rW58yukMhVH9FJZquT9nsOR2YNkm7YRfhC1IOc-kEuifIAq563kOZ2ikvu80A5ftnUPwofQbxsNEEqOKvGJ2y_hiNS7pz38kG-DYwaf8EbsIOCtNu0bN8lmine5jkGMmjk7TuoJsIW5S8MkEoasZlDFkCNEVnzoqvVi1JuQiC7lejdqsuC4FWjfmOsAS6lPCr_30sRuaKKqRU-qCDJ2rpGEkA4",
    rating: 4.8,
    voteCount: 1540,
    popularity: 92.8,
    releaseYear: 2024,
    releaseDate: "May 01, 2024",
    duration: 120,
    director: "Gabe Sterling",
    genres: ["Experimental", "Art House", "Cinematography"],
    language: "English"
  },
  {
    id: "crimson-convertible",
    title: "Red Crimson Convertible",
    tagline: "Drive Into the Night Sky",
    overview: "A majestic nighttime journey of a red vintage convertible driving through a pitch-black desert landscape under a starry sky, searching for a forgotten station.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMjhwFtKOOrplTLYpkzbSVue6QXmMVX-nOPLvQE4cHubQbREJ9Xs7zKIcpMMTDLDsgUW7AwCCid79b-XlawppfE9L7Ixj8Av4X3pcwjFm1napOts6ih6MTJ6yPaYqqYzms31FiBp9znFjMLGzXxT2QiBSLqDr0dE1cu5hgjITOjtx4ufhw53Kg9iXfySgm-Rkn14FsxLsHJijtgaOVK1lZou2Bx9T2wndIfcG4bvb2nul4Il9Y5HN1r5SJ5_tuJCWxGhhFbhb9qOwv",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMjhwFtKOOrplTLYpkzbSVue6QXmMVX-nOPLvQE4cHubQbREJ9Xs7zKIcpMMTDLDsgUW7AwCCid79b-XlawppfE9L7Ixj8Av4X3pcwjFm1napOts6ih6MTJ6yPaYqqYzms31FiBp9znFjMLGzXxT2QiBSLqDr0dE1cu5hgjITOjtx4ufhw53Kg9iXfySgm-Rkn14FsxLsHJijtgaOVK1lZou2Bx9T2wndIfcG4bvb2nul4Il9Y5HN1r5SJ5_tuJCWxGhhFbhb9qOwv",
    rating: 4.6,
    voteCount: 420,
    popularity: 79.1,
    releaseYear: 2023,
    releaseDate: "Jul 18, 2023",
    duration: 112,
    director: "Rene West",
    genres: ["Indie", "Adventure", "Poetic"],
    language: "English"
  },
  {
    id: "woman-underwater",
    title: "Woman Underwater",
    tagline: "Surrounded by Embers",
    overview: "A beautiful, surreal exploration of a woman in a crimson dress submerged in deep indigo-black water, surrounded by rising bubbles that look like tiny glowing embers.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK8w4YrRbZApoG5t1xzyS6HhyIlw4K4ZP2IheaFQyU_h9eJ22cbcb8WoP29NuzVb6-00OJe1-N6tmdq3zOxPjg9AIbc--Ifl5c19oVIz0itQc3yjRXAWYps0gEGniNChGvhcw3h0pmeDT8dw3djLwYJGA-Nzkh3MvNAFD6afWNcGeqCPJqtqEpr8bPQScM6j6yhsbHGVqol47QsFgpNVdF9GQF5I4BoTlEMxSCeMcBXmZ0O4LPMtBAGgNce1zJTKXWAIvnWZR4Z4sX",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK8w4YrRbZApoG5t1xzyS6HhyIlw4K4ZP2IheaFQyU_h9eJ22cbcb8WoP29NuzVb6-00OJe1-N6tmdq3zOxPjg9AIbc--Ifl5c19oVIz0itQc3yjRXAWYps0gEGniNChGvhcw3h0pmeDT8dw3djLwYJGA-Nzkh3MvNAFD6afWNcGeqCPJqtqEpr8bPQScM6j6yhsbHGVqol47QsFgpNVdF9GQF5I4BoTlEMxSCeMcBXmZ0O4LPMtBAGgNce1zJTKXWAIvnWZR4Z4sX",
    rating: 4.8,
    voteCount: 610,
    popularity: 87.9,
    releaseYear: 2024,
    releaseDate: "Aug 10, 2024",
    duration: 88,
    director: "Sarah Lind",
    genres: ["Surreal", "Drama", "Fantasy"],
    language: "Swedish"
  },
  {
    id: "brutalist-stairs",
    title: "Brutalist Stairs",
    tagline: "Descending Into the Unknown",
    overview: "A dramatic top-down view of a brutalist concrete staircase winding into pitch darkness. A single red light at the bottom creates a powerful, high-contrast rim light on the steps.",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTSdu_cSUiBm6-yWnJ9SKXNojZeNrlUkA9nt5oe18rjP3WWf7o3nN11We6i4kM0M83dMxQ0-PAjzROKdpgP6H-nVwHB2xUBNzpOtOgpsTYqtzbKjSe8NqvU0XsdzteFICtkIJaCvtgcMqmOPJv66gyqtfUQyqPCAKMq8PSUy0yKalMxPqY8O6wzXmKlbMN0hIrxGA9P95WmpPR4CxVho8zB5UJozrdOug_n5prReVTMLbdfDl24qaE5JRoo3qIIphtbgVzT3vkV5Yg",
    backdropUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTSdu_cSUiBm6-yWnJ9SKXNojZeNrlUkA9nt5oe18rjP3WWf7o3nN11We6i4kM0M83dMxQ0-PAjzROKdpgP6H-nVwHB2xUBNzpOtOgpsTYqtzbKjSe8NqvU0XsdzteFICtkIJaCvtgcMqmOPJv66gyqtfUQyqPCAKMq8PSUy0yKalMxPqY8O6wzXmKlbMN0hIrxGA9P95WmpPR4CxVho8zB5UJozrdOug_n5prReVTMLbdfDl24qaE5JRoo3qIIphtbgVzT3vkV5Yg",
    rating: 4.4,
    voteCount: 185,
    popularity: 61.2,
    releaseYear: 2024,
    releaseDate: "Sep 25, 2024",
    duration: 82,
    director: "Kenji Sato",
    genres: ["Minimalist", "Mystery", "Thriller"],
    language: "Japanese"
  }
];

export const GENRE_PRESETS = [
  "Sci-Fi",
  "Thriller",
  "Drama",
  "Mystery",
  "Noir",
  "Cyberpunk",
  "Documentary",
  "Experimental",
  "Art House",
  "Minimalist",
  "Surreal"
];

export const MOOD_EXAMPLES = [
  { label: "Melancholic Sci-Fi", icon: "✨" },
  { label: "Heart-pounding Suspense", icon: "🔥" },
  { label: "Cozy Retro Nostalgia", icon: "📼" },
  { label: "Dark Noir Thriller", icon: "🕵️" },
  { label: "A24 Aesthetic Drama", icon: "🎭" },
  { label: "Poetic Atmospheric Visuals", icon: "🌊" }
];
