// Reading metadata for the supplied seventh-edition PDF, not printed page numbers.
// start/end are inclusive, one-based physical PDF pages. Adjacent sections may
// share a page: include the boundary page when the preceding section continues
// above the next heading. Chapter ranges include their introductions and summaries.
// Only section/chapter headings and page positions are recorded; no book prose.
export const BOOK_MAP = {
  "edition": "JavaScript: The Definitive Guide · Seventh Edition (2020)",
  "expectedPageCount": 1245,
  "lessons": {
    "lesson-01": {
      "label": "§1.1–1.3",
      "ranges": [
        {
          "label": "§1.1 Exploring JavaScript",
          "start": 41,
          "end": 43
        },
        {
          "label": "§1.2 Hello World",
          "start": 43,
          "end": 44
        },
        {
          "label": "§1.3 A Tour of JavaScript",
          "start": 44,
          "end": 55
        }
      ]
    },
    "lesson-02": {
      "label": "Ch. 2; §§3.1–3.10",
      "ranges": [
        {
          "label": "Chapter 2 · Lexical Structure",
          "start": 60,
          "end": 70
        },
        {
          "label": "§§3.1–3.3 Overview and Definitions — Text",
          "start": 71,
          "end": 97
        },
        {
          "label": "§§3.4–3.7 Boolean Values — The Global Object",
          "start": 97,
          "end": 105
        },
        {
          "label": "§§3.8–3.10 Immutable Primitive Values and Mutable Object References — Variable Declaration and Assignment",
          "start": 105,
          "end": 133
        }
      ]
    },
    "lesson-03": {
      "label": "§§4.1–4.13",
      "ranges": [
        {
          "label": "§§4.1–4.6 Primary Expressions — Object Creation Expressions",
          "start": 136,
          "end": 148
        },
        {
          "label": "§§4.7–4.9 Operator Overview — Relational Expressions",
          "start": 148,
          "end": 174
        },
        {
          "label": "§§4.10–4.13 Logical Expressions — Miscellaneous Operators",
          "start": 174,
          "end": 195
        }
      ]
    },
    "lesson-04": {
      "label": "§§5.1–5.3; §§5.5.4, 5.5.6",
      "ranges": [
        {
          "label": "§§5.1–5.3 Expression Statements — Conditionals",
          "start": 198,
          "end": 210
        },
        {
          "label": "§5.5.4 return",
          "start": 229,
          "end": 230
        },
        {
          "label": "§5.5.6 throw",
          "start": 231,
          "end": 232
        }
      ]
    },
    "lesson-05": {
      "label": "§§5.4–5.5",
      "ranges": [
        {
          "label": "§5.4 Loops",
          "start": 210,
          "end": 223
        },
        {
          "label": "§5.5 Jumps",
          "start": 223,
          "end": 237
        }
      ]
    },
    "lesson-06": {
      "label": "§3.10; §§5.5.6–5.5.7, 5.7",
      "ranges": [
        {
          "label": "§3.10 Variable Declaration and Assignment",
          "start": 122,
          "end": 133
        },
        {
          "label": "§§5.5.6–5.5.7 throw — try/catch/finally",
          "start": 231,
          "end": 237
        },
        {
          "label": "§5.7 Declarations",
          "start": 243,
          "end": 247
        }
      ]
    },
    "lesson-07": {
      "label": "§§6.1–6.10",
      "ranges": [
        {
          "label": "§§6.1–6.3 Introduction to Objects — Querying and Setting Properties",
          "start": 250,
          "end": 266
        },
        {
          "label": "§§6.4–6.7 Deleting Properties — Extending Objects",
          "start": 266,
          "end": 275
        },
        {
          "label": "§§6.8–6.10 Serializing Objects — Extended Object Literal Syntax",
          "start": 276,
          "end": 291
        }
      ]
    },
    "lesson-08": {
      "label": "§§7.1–7.10",
      "ranges": [
        {
          "label": "§§7.1–7.5 Creating Arrays — Adding and Deleting Array Elements",
          "start": 294,
          "end": 306
        },
        {
          "label": "§§7.6–7.8 Iterating Arrays — Array Methods",
          "start": 306,
          "end": 332
        },
        {
          "label": "§§7.9–7.10 Array-Like Objects — Strings as Arrays",
          "start": 332,
          "end": 336
        }
      ]
    },
    "lesson-09": {
      "label": "§§8.1–8.3",
      "ranges": [
        {
          "label": "§8.1 Defining Functions",
          "start": 339,
          "end": 347
        },
        {
          "label": "§8.2 Invoking Functions",
          "start": 347,
          "end": 357
        },
        {
          "label": "§8.3 Function Arguments and Parameters",
          "start": 357,
          "end": 370
        }
      ]
    },
    "lesson-10": {
      "label": "§§8.4–8.6, 8.8",
      "ranges": [
        {
          "label": "§§8.4–8.6 Functions as Values — Closures",
          "start": 370,
          "end": 385
        },
        {
          "label": "§8.8 Functional Programming",
          "start": 392,
          "end": 401
        }
      ]
    },
    "lesson-11": {
      "label": "§§8.2–8.3, 8.7–8.8",
      "ranges": [
        {
          "label": "§§8.2–8.3 Invoking Functions — Function Arguments and Parameters",
          "start": 347,
          "end": 370
        },
        {
          "label": "§§8.7–8.8 Function Properties, Methods, and Constructor — Functional Programming",
          "start": 385,
          "end": 401
        }
      ]
    },
    "lesson-12": {
      "label": "Integration studio · Chapters 6–8",
      "ranges": [
        {
          "label": "Chapter 6 · Objects",
          "start": 250,
          "end": 292
        },
        {
          "label": "Chapter 7 · Arrays",
          "start": 293,
          "end": 337
        },
        {
          "label": "Chapter 8 · Functions",
          "start": 338,
          "end": 402
        }
      ]
    },
    "lesson-13": {
      "label": "§§9.1–9.2; review §6.3",
      "ranges": [
        {
          "label": "§9.1 Classes and Prototypes",
          "start": 404,
          "end": 407
        },
        {
          "label": "§9.2 Classes and Constructors",
          "start": 407,
          "end": 416
        },
        {
          "label": "§6.3 Querying and Setting Properties",
          "start": 257,
          "end": 266
        }
      ]
    },
    "lesson-14": {
      "label": "§§9.3–9.4",
      "ranges": [
        {
          "label": "§9.3 Classes with the class Keyword",
          "start": 416,
          "end": 427
        },
        {
          "label": "§9.4 Adding Methods to Existing Classes",
          "start": 428,
          "end": 429
        }
      ]
    },
    "lesson-15": {
      "label": "§9.5 · Subclasses and delegation",
      "ranges": [
        {
          "label": "§9.5 Subclasses",
          "start": 429,
          "end": 447
        }
      ]
    },
    "lesson-16": {
      "label": "§§10.1–10.3",
      "ranges": [
        {
          "label": "§10.1 Modules with Classes, Objects, and Closures",
          "start": 450,
          "end": 454
        },
        {
          "label": "§10.2 Modules in Node",
          "start": 454,
          "end": 458
        },
        {
          "label": "§10.3 Modules in ES6",
          "start": 458,
          "end": 477
        }
      ]
    },
    "lesson-17": {
      "label": "Module design workshop · Chapter 10",
      "ranges": [
        {
          "label": "Chapter 10 · Modules",
          "start": 449,
          "end": 478
        }
      ]
    },
    "lesson-18": {
      "label": "Integration studio · Chapters 9–10",
      "ranges": [
        {
          "label": "Chapter 9 · Classes",
          "start": 403,
          "end": 448
        },
        {
          "label": "Chapter 10 · Modules",
          "start": 449,
          "end": 478
        }
      ]
    },
    "lesson-19": {
      "label": "§§11.1–11.2, 11.6, 11.9",
      "ranges": [
        {
          "label": "§11.1 Sets and Maps",
          "start": 480,
          "end": 491
        },
        {
          "label": "§11.2 Typed Arrays and Binary Data",
          "start": 492,
          "end": 503
        },
        {
          "label": "§11.6 JSON Serialization and Parsing",
          "start": 545,
          "end": 551
        },
        {
          "label": "§11.9 URL APIs",
          "start": 569,
          "end": 575
        }
      ]
    },
    "lesson-20": {
      "label": "§§11.3–11.4, 11.7",
      "ranges": [
        {
          "label": "§11.3 Pattern Matching with Regular Expressions",
          "start": 503,
          "end": 536
        },
        {
          "label": "§11.4 Dates and Times",
          "start": 536,
          "end": 542
        },
        {
          "label": "§11.7 The Internationalization API",
          "start": 551,
          "end": 564
        }
      ]
    },
    "lesson-21": {
      "label": "§§12.1–12.4",
      "ranges": [
        {
          "label": "§12.1 How Iterators Work",
          "start": 580,
          "end": 582
        },
        {
          "label": "§12.2 Implementing Iterable Objects",
          "start": 582,
          "end": 588
        },
        {
          "label": "§12.3 Generators",
          "start": 588,
          "end": 594
        },
        {
          "label": "§12.4 Advanced Generator Features",
          "start": 594,
          "end": 600
        }
      ]
    },
    "lesson-22": {
      "label": "§§13.1–13.2",
      "ranges": [
        {
          "label": "§13.1 Asynchronous Programming with Callbacks",
          "start": 603,
          "end": 610
        },
        {
          "label": "§13.2 Promises",
          "start": 610,
          "end": 646
        }
      ]
    },
    "lesson-23": {
      "label": "§§13.2.5, 13.3; concurrency workshop",
      "ranges": [
        {
          "label": "§13.2.5 Promises in Parallel",
          "start": 634,
          "end": 636
        },
        {
          "label": "§13.3 async and await",
          "start": 646,
          "end": 651
        }
      ]
    },
    "lesson-24": {
      "label": "Integration studio · Chapters 11–13",
      "ranges": [
        {
          "label": "Chapter 11 · The JavaScript Standard Library",
          "start": 479,
          "end": 578
        },
        {
          "label": "Chapter 12 · Iterators and Generators",
          "start": 579,
          "end": 601
        },
        {
          "label": "Chapter 13 · Asynchronous JavaScript",
          "start": 602,
          "end": 663
        }
      ]
    },
    "lesson-25": {
      "label": "§§15.1–15.2",
      "ranges": [
        {
          "label": "§15.1 Web Programming Basics",
          "start": 716,
          "end": 742
        },
        {
          "label": "§15.2 Events",
          "start": 742,
          "end": 760
        }
      ]
    },
    "lesson-26": {
      "label": "§§15.3–15.4",
      "ranges": [
        {
          "label": "§15.3 Scripting Documents",
          "start": 760,
          "end": 785
        },
        {
          "label": "§15.4 Scripting CSS",
          "start": 785,
          "end": 797
        }
      ]
    },
    "lesson-27": {
      "label": "§§15.2–15.3; forms workshop",
      "ranges": [
        {
          "label": "§15.2 Events",
          "start": 742,
          "end": 760
        },
        {
          "label": "§15.3 Scripting Documents",
          "start": 760,
          "end": 785
        }
      ]
    },
    "lesson-28": {
      "label": "§§15.11–15.12",
      "ranges": [
        {
          "label": "§15.11 Networking",
          "start": 896,
          "end": 925
        },
        {
          "label": "§15.12 Storage",
          "start": 926,
          "end": 946
        }
      ]
    },
    "lesson-29": {
      "label": "§§15.5–15.10, 15.13",
      "ranges": [
        {
          "label": "§§15.5–15.6 Document Geometry and Scrolling — Web Components",
          "start": 797,
          "end": 826
        },
        {
          "label": "§§15.7–15.8 SVG: Scalable Vector Graphics — Graphics in a <canvas>",
          "start": 826,
          "end": 878
        },
        {
          "label": "§§15.9–15.10 Audio APIs — Location, Navigation, and History",
          "start": 878,
          "end": 896
        },
        {
          "label": "§15.13 Worker Threads and Messaging",
          "start": 946,
          "end": 959
        }
      ]
    },
    "lesson-30": {
      "label": "Integration studio · Chapter 15",
      "ranges": [
        {
          "label": "Chapter 15 · JavaScript in Web Browsers",
          "start": 713,
          "end": 993
        }
      ]
    },
    "lesson-31": {
      "label": "§§16.1–16.2",
      "ranges": [
        {
          "label": "§16.1 Node Programming Basics",
          "start": 995,
          "end": 1003
        },
        {
          "label": "§16.2 Node Is Asynchronous by Default",
          "start": 1003,
          "end": 1009
        }
      ]
    },
    "lesson-32": {
      "label": "§§16.3, 16.5, 16.7",
      "ranges": [
        {
          "label": "§16.3 Buffers",
          "start": 1009,
          "end": 1012
        },
        {
          "label": "§16.5 Streams",
          "start": 1016,
          "end": 1035
        },
        {
          "label": "§16.7 Working with Files",
          "start": 1038,
          "end": 1055
        }
      ]
    },
    "lesson-33": {
      "label": "§16.8; review §16.2",
      "ranges": [
        {
          "label": "§16.8 HTTP Clients and Servers",
          "start": 1055,
          "end": 1063
        },
        {
          "label": "§16.2 Node Is Asynchronous by Default",
          "start": 1003,
          "end": 1009
        }
      ]
    },
    "lesson-34": {
      "label": "§§14.1–14.4, 14.6–14.7",
      "ranges": [
        {
          "label": "§§14.1–14.2 Property Attributes — Object Extensibility",
          "start": 665,
          "end": 675
        },
        {
          "label": "§§14.3–14.4 The prototype Attribute — Well-Known Symbols",
          "start": 675,
          "end": 691
        },
        {
          "label": "§§14.6–14.7 The Reflect API — Proxy Objects",
          "start": 695,
          "end": 710
        }
      ]
    },
    "lesson-35": {
      "label": "§§17.1–17.5; delivery workshop",
      "ranges": [
        {
          "label": "§17.1 Linting with ESLint",
          "start": 1094,
          "end": 1096
        },
        {
          "label": "§17.2 JavaScript Formatting with Prettier",
          "start": 1096,
          "end": 1098
        },
        {
          "label": "§17.3 Unit Testing with Jest",
          "start": 1098,
          "end": 1102
        },
        {
          "label": "§17.4 Package Management with npm",
          "start": 1102,
          "end": 1104
        },
        {
          "label": "§17.5 Code Bundling",
          "start": 1104,
          "end": 1108
        }
      ]
    },
    "lesson-36": {
      "label": "Final integration · Chapters 1–17",
      "ranges": [
        {
          "label": "Chapters 1–5 · Introduction to JavaScript — Statements",
          "start": 38,
          "end": 249
        },
        {
          "label": "Chapters 6–10 · Objects — Modules",
          "start": 250,
          "end": 478
        },
        {
          "label": "Chapters 11–14 · The JavaScript Standard Library — Metaprogramming",
          "start": 479,
          "end": 712
        },
        {
          "label": "Chapter 15 · JavaScript in Web Browsers",
          "start": 713,
          "end": 993
        },
        {
          "label": "Chapters 16–17 · Server-Side JavaScript with Node — JavaScript Tools and Extensions",
          "start": 994,
          "end": 1143
        }
      ]
    }
  }
};
