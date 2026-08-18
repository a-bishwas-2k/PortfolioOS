// Terminal Interactive Games Engine for PortfolioOS

const TECH_WORDS = [
  // --- SQL ---
  {
    word: 'JOIN',
    category: 'SQL',
    difficulty: 'Basic',
    hint: 'Combines rows from two or more tables based on a related column between them.',
    keyPoints: [
      'INNER JOIN returns only matching records from both tables.',
      'LEFT JOIN returns all rows from the left table and matching rows from the right table.',
      'CROSS JOIN generates the Cartesian product of all rows in both tables.'
    ]
  },
  {
    word: 'PRIMARYKEY',
    category: 'SQL',
    difficulty: 'Basic',
    hint: 'Uniquely identifies each record in a database table without duplicate or NULL values.',
    keyPoints: [
      'A primary key must contain UNIQUE values and cannot contain NULL.',
      'Each table can have only ONE primary key constraint (simple or composite).',
      'In storage engines like MySQL InnoDB, the primary key defines the physical clustered index.'
    ]
  },
  {
    word: 'FOREIGNKEY',
    category: 'SQL',
    difficulty: 'Basic',
    hint: 'A column or group of columns in a table that links to the primary key of another table.',
    keyPoints: [
      'Enforces referential integrity between parent and child database tables.',
      'Prevents orphan records unless CASCADE DELETE / UPDATE rules are configured.',
      'Can accept NULL values unless explicitly declared with NOT NULL.'
    ]
  },
  {
    word: 'GROUPBY',
    category: 'SQL',
    difficulty: 'Intermediate',
    hint: 'Groups rows that have identical values in specified columns into summary rows.',
    keyPoints: [
      'Used alongside aggregate functions like COUNT(), SUM(), AVG(), MIN(), MAX().',
      'Filters applied before grouping use WHERE; filters on aggregated groups require HAVING.',
      'Selected non-aggregate columns must be explicitly listed in the GROUP BY clause.'
    ]
  },
  {
    word: 'HAVING',
    category: 'SQL',
    difficulty: 'Intermediate',
    hint: 'Clause used to filter aggregated group results produced by a GROUP BY statement.',
    keyPoints: [
      'WHERE filters individual table rows BEFORE aggregation happens.',
      'HAVING filters calculated aggregate values AFTER GROUP BY grouping is performed.',
      'Supports aggregate expressions such as HAVING COUNT(order_id) > 10.'
    ]
  },
  {
    word: 'TRANSACTION',
    category: 'SQL',
    difficulty: 'Intermediate',
    hint: 'A sequence of database operations executed as a single logical unit of work.',
    keyPoints: [
      'Guarantees ACID compliance (Atomicity, Consistency, Isolation, Durability).',
      'Committed permanently using COMMIT or reverted entirely using ROLLBACK.',
      'Prevents dirty reads and data corruption during hardware or network failures.'
    ]
  },
  {
    word: 'INDEXING',
    category: 'SQL',
    difficulty: 'Intermediate',
    hint: 'A data structure technique used to quickly locate and access target rows in a database.',
    keyPoints: [
      'Accelerates SELECT query search speed from O(N) full scan to O(log N) lookup.',
      'Increases storage overhead and slows down write operations (INSERT, UPDATE, DELETE).',
      'Common index types include B-Tree, Hash, GIN, GiST, and Full-Text indexes.'
    ]
  },
  {
    word: 'SUBQUERY',
    category: 'SQL',
    difficulty: 'Intermediate',
    hint: 'A SQL query nested inside another SELECT, INSERT, UPDATE, or DELETE statement.',
    keyPoints: [
      'Non-correlated subqueries execute once and pass results to the outer query.',
      'Correlated subqueries evaluate once for every candidate row processed by the outer query.',
      'Can often be rewritten with JOINs for significant query planner optimization.'
    ]
  },
  {
    word: 'WINDOWFUNCTION',
    category: 'SQL',
    difficulty: 'Advanced',
    hint: 'Performs calculations across a set of table rows related to the current row without collapsing them.',
    keyPoints: [
      'Defined using the OVER() clause with PARTITION BY and ORDER BY specifications.',
      'Includes functions like ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), and LEAD().',
      'Retains individual row identities while calculating running totals or moving averages.'
    ]
  },
  {
    word: 'PROCEDURE',
    category: 'SQL',
    difficulty: 'Advanced',
    hint: 'A precompiled group of SQL statements stored directly on the database server.',
    keyPoints: [
      'Can accept IN, OUT, and INOUT parameters to pass data into and out of execution.',
      'Reduces network round-trips by running multi-step business logic directly on the database.',
      'Can manage transactions using COMMIT and ROLLBACK inside the stored block.'
    ]
  },
  {
    word: 'TRIGGER',
    category: 'SQL',
    difficulty: 'Advanced',
    hint: 'Automated database code executed when specific DML actions occur on a table.',
    keyPoints: [
      'Fires BEFORE or AFTER INSERT, UPDATE, or DELETE operations.',
      'Accesses pseudo-records :NEW and :OLD to compare incoming vs existing row values.',
      'Ideal for audit trail logging, enforcing complex business rules, and updating derived tables.'
    ]
  },
  {
    word: 'VIEW',
    category: 'SQL',
    difficulty: 'Basic',
    hint: 'A saved SQL query representing a virtual table without storing data physically.',
    keyPoints: [
      'Simplifies complex joins into a single clean virtual table interface.',
      'Restricts access to sensitive columns by exposing only specific view projections.',
      'Materialized Views physically persist results and require periodic refresh operations.'
    ]
  },

  // --- JAVA ---
  {
    word: 'JVM',
    category: 'Java',
    difficulty: 'Basic',
    hint: 'Virtual machine that executes Java bytecode, enabling write-once-run-anywhere flexibility.',
    keyPoints: [
      'Converts compiled Java bytecode (.class files) into native host OS machine instructions.',
      'Consists of ClassLoader, Memory Areas (Heap, Stack, Method Area), and Execution Engine.',
      'Employs Just-In-Time (JIT) compiler to dynamically compile bytecode to native code.'
    ]
  },
  {
    word: 'POLYMORPHISM',
    category: 'Java',
    difficulty: 'Basic',
    hint: 'OOP principle enabling objects to take on multiple forms depending on runtime context.',
    keyPoints: [
      'Compile-time polymorphism: Method Overloading (same name, different parameter lists).',
      'Runtime polymorphism: Method Overriding (subclass provides specific method implementation).',
      'Promotes loose coupling and extensible software design architectures.'
    ]
  },
  {
    word: 'ENCAPSULATION',
    category: 'Java',
    difficulty: 'Basic',
    hint: 'Bundling state variables and behavior into a single class while restricting direct access.',
    keyPoints: [
      'Achieved by declaring class fields private and providing public getter and setter methods.',
      'Protects internal object state against unintended external mutation.',
      'Allows internal implementation details to change without breaking external caller code.'
    ]
  },
  {
    word: 'INHERITANCE',
    category: 'Java',
    difficulty: 'Basic',
    hint: 'Mechanism where a child subclass derives fields and methods from a parent superclass.',
    keyPoints: [
      'Uses the extends keyword to establish an IS-A relationship between classes.',
      'Java supports single class inheritance to avoid the Diamond Problem ambiguity.',
      'Subclasses can reuse, extend, or override non-private methods of the parent class.'
    ]
  },
  {
    word: 'INTERFACE',
    category: 'Java',
    difficulty: 'Intermediate',
    hint: 'An abstract type used to specify a contract of methods that implementing classes must satisfy.',
    keyPoints: [
      'Classes implement interfaces using the implements keyword (supports multiple interfaces).',
      'Java 8 introduced default and static methods inside interfaces.',
      'All interface fields are implicitly public, static, and final constants.'
    ]
  },
  {
    word: 'GARBAGECOLLECTOR',
    category: 'Java',
    difficulty: 'Intermediate',
    hint: 'Automatic JVM memory management process that frees memory occupied by unreferenced objects.',
    keyPoints: [
      'Eliminates manual memory management bugs such as memory leaks and dangling pointers.',
      'Heap memory is segregated into Young Generation (Eden/Survivor) and Old Generation.',
      'Popular GC algorithms include G1GC, ZGC, Shenandoah, and Parallel GC.'
    ]
  },
  {
    word: 'MULTITHREADING',
    category: 'Java',
    difficulty: 'Intermediate',
    hint: 'Concurrent execution of multiple threads within a single Java application process.',
    keyPoints: [
      'Threads created by extending Thread class or implementing Runnable / Callable interfaces.',
      'Synchronization mechanisms (synchronized keyword, ReentrantLock) prevent race conditions.',
      'ExecutorService manages worker thread pools for high-throughput task processing.'
    ]
  },
  {
    word: 'SYNCHRONIZED',
    category: 'Java',
    difficulty: 'Intermediate',
    hint: 'Java keyword ensuring only one thread can execute a critical code block at any given time.',
    keyPoints: [
      'Acquires an intrinsic monitor lock on the specified object or class instance.',
      'Prevents data race conditions when multiple threads access shared mutable state.',
      'Excessive synchronization causes thread contention and latency bottlenecks.'
    ]
  },
  {
    word: 'VOLATILE',
    category: 'Java',
    difficulty: 'Advanced',
    hint: 'Keyword guaranteeing variable updates are written to and read from main memory immediately.',
    keyPoints: [
      'Ensures thread visibility by flushing CPU cache writes directly to main RAM.',
      'Prevents instruction reordering around volatile reads and writes by compiler/CPU.',
      'Does NOT provide mutual exclusion or atomic compound operations like incrementing.'
    ]
  },
  {
    word: 'REFLECTION',
    category: 'Java',
    difficulty: 'Advanced',
    hint: 'Java API permitting runtime inspection and dynamic invocation of classes, fields, and methods.',
    keyPoints: [
      'Extensively utilized by frameworks like Spring (IoC Container), Hibernate, and JUnit.',
      'Enables access to private class members via setAccessible(true).',
      'Incurs performance overhead and bypasses compile-time type safety checks.'
    ]
  },
  {
    word: 'GENERICS',
    category: 'Java',
    difficulty: 'Intermediate',
    hint: 'Feature enabling classes, interfaces, and methods to operate on parameterized types safely.',
    keyPoints: [
      'Provides strong compile-time type checking and eliminates explicit type casting.',
      'Implemented via Type Erasure: generic types are removed by the compiler at runtime.',
      'Supports bounded wildcards like List<? extends Number> and List<? super Integer>.'
    ]
  },
  {
    word: 'ANNOTATION',
    category: 'Java',
    difficulty: 'Basic',
    hint: 'Metadata tag added to Java source elements prefixed with the @ symbol.',
    keyPoints: [
      'Standard annotations include @Override, @Deprecated, and @SuppressWarnings.',
      'Framework annotations (@Entity, @Autowired) drive runtime dependency injection.',
      'Processed at compile-time (APT) or at runtime using Java Reflection.'
    ]
  },

  // --- PYTHON ---
  {
    word: 'LISTCOMPREHENSION',
    category: 'Python',
    difficulty: 'Basic',
    hint: 'Concise syntax for constructing new lists from existing iterables in Python.',
    keyPoints: [
      'Basic structure: [expression for item in iterable if condition].',
      'More readable and faster than writing traditional for loops with list.append().',
      'Can be nested, but over-nesting should be avoided for code maintainability.'
    ]
  },
  {
    word: 'DECORATOR',
    category: 'Python',
    difficulty: 'Intermediate',
    hint: 'Function that modifies or enhances the behavior of another function without altering its code.',
    keyPoints: [
      'Applied using the @decorator_name syntax placed above a function definition.',
      'Leverages first-class functions: functions passed as arguments and returned.',
      'Common built-in decorators: @staticmethod, @classmethod, @property, @functools.wraps.'
    ]
  },
  {
    word: 'GENERATOR',
    category: 'Python',
    difficulty: 'Intermediate',
    hint: 'A special function returning an iterator that produces values lazily using the yield statement.',
    keyPoints: [
      'Memory efficient: computes items on demand rather than storing entire lists in RAM.',
      'Preserves function execution state between successive next() invocations.',
      'Ideal for streaming huge data files, logs, and infinite sequences.'
    ]
  },
  {
    word: 'DICTIONARY',
    category: 'Python',
    difficulty: 'Basic',
    hint: 'Built-in associative key-value data structure powered by a hash table implementation.',
    keyPoints: [
      'Key lookup, insertion, and deletion have average O(1) time complexity.',
      'Keys must be hashable immutable types (strings, numbers, tuples); values can be anything.',
      'Maintains key insertion order by default in Python 3.7+.'
    ]
  },
  {
    word: 'GIL',
    category: 'Python',
    difficulty: 'Advanced',
    hint: 'Global Interpreter Lock — mutex in CPython allowing only one thread to execute bytecode at once.',
    keyPoints: [
      'Ensures thread safety for CPython memory management and reference counting.',
      'Prevents CPU-bound Python threads from utilizing multiple CPU cores simultaneously.',
      'I/O-bound multithreading works well because the GIL is released during I/O wait times.'
    ]
  },
  {
    word: 'METACLASS',
    category: 'Python',
    difficulty: 'Advanced',
    hint: 'The class of a class in Python, defining how classes are instantiated and configured.',
    keyPoints: [
      'In Python, classes are themselves objects created by metaclasses (default is type).',
      'Custom metaclasses inherit from type and override __new__ or __init__ methods.',
      'Used by Django ORM and Pydantic to validate and auto-inject class attributes.'
    ]
  },
  {
    word: 'VIRTUALENV',
    category: 'Python',
    difficulty: 'Basic',
    hint: 'Isolated Python environment allowing project-specific dependencies without global conflicts.',
    keyPoints: [
      'Created using built-in venv module: python -m venv env_name.',
      'Isolates installed packages into a local directory for seamless project portability.',
      'Prevents dependency version conflicts between different Python projects on the same machine.'
    ]
  },
  {
    word: 'DUNDER',
    category: 'Python',
    difficulty: 'Basic',
    hint: 'Special methods enclosed by double underscores used for object initialization and magic behavior.',
    keyPoints: [
      'Short for Double UNDERscore methods (e.g. __init__, __repr__, __str__).',
      'Enables custom operator overloading like __add__, __eq__, __len__, and __getitem__.',
      'Hooked automatically by built-in functions like len(obj) calling obj.__len__().'
    ]
  },
  {
    word: 'LAMBDA',
    category: 'Python',
    difficulty: 'Basic',
    hint: 'Small, anonymous single-expression inline function defined with the lambda keyword.',
    keyPoints: [
      'Syntax: lambda arguments: expression (implicitly returns evaluation result).',
      'Frequently used in higher-order functions like map(), filter(), and sorted().',
      'Should be kept short; complex logic is better written as standard def functions.'
    ]
  },
  {
    word: 'ASYNCIO',
    category: 'Python',
    difficulty: 'Advanced',
    hint: 'Asynchronous I/O framework running concurrent tasks using an event loop and async/await syntax.',
    keyPoints: [
      'Single-threaded cooperative multitasking designed for high-concurrency network tasks.',
      'Functions declared with async def return coroutine objects that require await.',
      'asyncio.gather() schedules and executes multiple asynchronous coroutines concurrently.'
    ]
  },
  {
    word: 'DATAFRAME',
    category: 'Python',
    difficulty: 'Intermediate',
    hint: 'Two-dimensional tabular data structure with labeled axes in libraries like Pandas & PySpark.',
    keyPoints: [
      'Primary data container for data analysis, cleaning, filtering, and aggregation.',
      'Employs vectorized operations under the hood for fast C-level performance.',
      'Integrates smoothly with CSV, Parquet, JSON, SQL databases, and NumPy arrays.'
    ]
  },

  // --- DATABASE & STORAGE ---
  {
    word: 'POSTGRESQL',
    category: 'Database',
    difficulty: 'Basic',
    hint: 'Open-source object-relational database famed for SQL compliance, reliability, and JSONB support.',
    keyPoints: [
      'Supports structured relational tables alongside unstructured JSONB and geospatial PostGIS data.',
      'Uses MVCC (Multi-Version Concurrency Control) for high concurrency without read locks.',
      'Highly extensible through foreign data wrappers (FDW), custom functions, and extensions.'
    ]
  },
  {
    word: 'MONGODB',
    category: 'Database',
    difficulty: 'Basic',
    hint: 'Leading document NoSQL database storing records as flexible, schema-less BSON documents.',
    keyPoints: [
      'Documents in collections can have dynamic, varying schema fields.',
      'High availability provided via replica set Primary-Secondary automatic failover.',
      'Scales horizontally using built-in database sharding across server clusters.'
    ]
  },
  {
    word: 'REDIS',
    category: 'Database',
    difficulty: 'Intermediate',
    hint: 'Ultra-fast in-memory data store used for high-performance caching, sessions, and pub/sub messaging.',
    keyPoints: [
      'Delivers sub-millisecond response latency by keeping data strictly in system RAM.',
      'Supports rich data structures: Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps.',
      'Provides persistence via RDB snapshotting and AOF (Append-Only File) log files.'
    ]
  },
  {
    word: 'ACID',
    category: 'Database',
    difficulty: 'Intermediate',
    hint: 'Acronym summarizing the four key properties of reliable relational database transactions.',
    keyPoints: [
      'Atomicity: All operations in a transaction succeed completely or roll back entirely.',
      'Consistency: Transactions transition the database from one valid state to another.',
      'Isolation: Concurrent transactions do not cross-contaminate uncommitted state.',
      'Durability: Committed updates persist permanently even through system power outages.'
    ]
  },
  {
    word: 'CAPTHEOREM',
    category: 'Database',
    difficulty: 'Advanced',
    hint: 'Theorem proving distributed databases can guarantee only 2 of 3: Consistency, Availability, Partition Tolerance.',
    keyPoints: [
      'CP Systems: Prioritize Consistency over Availability during network split partitions.',
      'AP Systems: Prioritize Availability over Consistency during network split partitions.',
      'Because network partitions (P) are inevitable in distributed systems, design forces a choice between C and A.'
    ]
  },
  {
    word: 'SHARDING',
    category: 'Database',
    difficulty: 'Advanced',
    hint: 'Horizontal partitioning strategy distributing database rows across multiple independent servers.',
    keyPoints: [
      'Distributes storage capacity and CPU load across a cluster of database instances.',
      'Uses a Shard Key to determine which physical shard holds a given record.',
      'Increases architecture complexity for cross-shard joins and distributed transactions.'
    ]
  },
  {
    word: 'REPLICATION',
    category: 'Database',
    difficulty: 'Intermediate',
    hint: 'Copying database state onto secondary replica nodes for redundancy and read scaling.',
    keyPoints: [
      'Primary-Replica topology: Writes go to Primary, while Reads scale out across Replicas.',
      'Synchronous replication ensures zero data loss but increases write transaction latency.',
      'Asynchronous replication delivers faster writes but risks slight replica lag.'
    ]
  },
  {
    word: 'NORMALIZATION',
    category: 'Database',
    difficulty: 'Intermediate',
    hint: 'Process of organizing table columns to reduce data redundancy and improve data integrity.',
    keyPoints: [
      '1NF: Ensure atomic column values and remove repeating groups.',
      '2NF: Remove partial dependencies on composite primary keys.',
      '3NF: Remove transitive dependencies where non-key attributes depend on non-key attributes.'
    ]
  },
  {
    word: 'DENORMALIZATION',
    category: 'Database',
    difficulty: 'Intermediate',
    hint: 'Intentionally introducing data redundancy into schema design to optimize read query performance.',
    keyPoints: [
      'Commonly applied in OLAP data warehouses and reporting databases to avoid massive joins.',
      'Boosts read speed at the expense of extra disk storage and slower write updates.',
      'Requires application logic or triggers to keep redundant copy columns synchronized.'
    ]
  },
  {
    word: 'CONNECTIONPOOL',
    category: 'Database',
    difficulty: 'Advanced',
    hint: 'A cached pool of pre-opened database connections reused across application HTTP requests.',
    keyPoints: [
      'Opening fresh database TCP connections per request is CPU and latency expensive.',
      'Connection poolers (e.g. HikariCP, PgBouncer) maintain ready connections for instant checkout.',
      'Limits maximum active connections to prevent database memory exhaustion under load.'
    ]
  },
  {
    word: 'WAL',
    category: 'Database',
    difficulty: 'Advanced',
    hint: 'Write-Ahead Logging — recording database mutations to a persistent log file prior to writing table pages.',
    keyPoints: [
      'Crucial for transaction Durability and automated crash recovery after unexpected shutdowns.',
      'Powers Point-In-Time Recovery (PITR) and streaming replication topologies.',
      'Guarantees dirty memory buffers can be safely reconstructed after a system crash.'
    ]
  },
  {
    word: 'DEADLOCK',
    category: 'Database',
    difficulty: 'Intermediate',
    hint: 'Condition where two transactions are blocked indefinitely, each waiting for locks held by the other.',
    keyPoints: [
      'Database engines detect deadlocks automatically using wait-for cycle graph checks.',
      'The engine breaks deadlocks by aborting and rolling back the lower-cost transaction.',
      'Prevented by enforcing uniform lock acquisition order throughout application queries.'
    ]
  },
  {
    word: 'ORM',
    category: 'Database',
    difficulty: 'Basic',
    hint: 'Object-Relational Mapping — framework mapping database tables to native programming language classes.',
    keyPoints: [
      'Popular ORMs: Hibernate (Java), SQLAlchemy (Python), Prisma (TypeScript), Entity Framework (.NET).',
      'Enables developers to query and manipulate database objects using object-oriented code.',
      'Developers must monitor for the N+1 query problem caused by lazy loading.'
    ]
  },

  // --- CORE CS & WEB ---
  {
    word: 'EVENTLOOP',
    category: 'Core CS',
    difficulty: 'Intermediate',
    hint: 'Non-blocking I/O loop in JavaScript & Node.js coordinating asynchronous callbacks and tasks.',
    keyPoints: [
      'Continuously monitors the Call Stack, Microtask Queue (Promises), and Macrotask Queue (timers/I/O).',
      'Single-threaded execution model eliminates thread lock contention while scaling I/O.',
      'Heavy synchronous CPU tasks block the Event Loop and degrade server responsiveness.'
    ]
  },
  {
    word: 'RECURSION',
    category: 'Core CS',
    difficulty: 'Basic',
    hint: 'Programming technique where a function invokes itself to break down problems into subproblems.',
    keyPoints: [
      'Must contain a valid Base Case to stop recursion and prevent StackOverflow exceptions.',
      'Every recursive invocation pushes a new stack frame onto the Call Stack.',
      'Tail Call Optimization (TCO) allows eligible recursive calls to reuse stack frames.'
    ]
  },
  {
    word: 'VIRTUALDOM',
    category: 'Core CS',
    difficulty: 'Basic',
    hint: 'Lightweight in-memory tree representation of the actual browser DOM used by React.',
    keyPoints: [
      'On state updates, React constructs a new Virtual DOM tree and diffs it with the previous snapshot.',
      'Calculates minimal required updates (Reconciliation) and updates the real DOM efficiently.',
      'Minimizes costly direct browser layout repaints and reflows.'
    ]
  },
  {
    word: 'IDEMPOTENT',
    category: 'Core CS',
    difficulty: 'Intermediate',
    hint: 'An operation that yields identical system state regardless of how many times it is executed.',
    keyPoints: [
      'HTTP verbs GET, PUT, and DELETE are idempotent; POST is non-idempotent.',
      'Essential for robust API design so client network retries do not duplicate state mutations.',
      'SQL query example: UPDATE users SET active=true WHERE id=5 is fully idempotent.'
    ]
  },
  {
    word: 'REST',
    category: 'Core CS',
    difficulty: 'Basic',
    hint: 'Representational State Transfer — architectural design standard for HTTP web APIs.',
    keyPoints: [
      'Stateless protocol: each request carries all information required for processing.',
      'Uses standard HTTP verbs: GET (Read), POST (Create), PUT/PATCH (Update), DELETE (Remove).',
      'Leverages standard HTTP status codes (200, 201, 400, 401, 404, 500) for response feedback.'
    ]
  },
  {
    word: 'GRAPHQL',
    category: 'Core CS',
    difficulty: 'Intermediate',
    hint: 'API query language allowing clients to request exact fields needed from a single endpoint.',
    keyPoints: [
      'Prevents over-fetching and under-fetching by specifying output schemas on the client.',
      'Single HTTP endpoint (/graphql) handling Queries (Read), Mutations (Write), Subscriptions.',
      'Strongly typed schema guarantees contract safety between frontend and backend.'
    ]
  },
  {
    word: 'JWT',
    category: 'Core CS',
    difficulty: 'Basic',
    hint: 'JSON Web Token — compact, URL-safe token standard for stateless web user authentication.',
    keyPoints: [
      'Composed of three base64URL encoded sections: Header, Payload, and Signature.',
      'Cryptographically signed by server using secret HMAC keys or RSA public/private keypairs.',
      'Stateless: backend verifies signature validity without querying a session database.'
    ]
  }
];

const TYPING_PROMPTS = [
  'const future = await buildAwesomeApps();',
  'git commit -m "feat: added interactive terminal games"',
  'framer-motion brings fluid 60fps animations to life',
  'console.log("Welcome to PortfolioOS Interactive Shell!");',
  'npm run dev -- --host 0.0.0.0 --port 5173'
];

/**
 * Initialize game state when a game command is invoked.
 */
export const initGame = (gameName, args = []) => {
  switch (gameName.toLowerCase()) {
    case 'ttt':
    case 'tictactoe':
      return {
        name: 'tictactoe',
        board: Array(9).fill(null),
        score: { player: 0, ai: 0, ties: 0 },
        status: 'playing', // playing | ended
        lastMessage: 'Your turn! Enter a number (1-9) to place ❌:'
      };

    case 'guess':
    case 'numberguess':
      return {
        name: 'guess',
        target: Math.floor(Math.random() * 100) + 1,
        attempts: 0,
        min: 1,
        max: 100,
        status: 'playing',
        lastMessage: 'I have picked a secret number between 1 and 100. Enter your guess:'
      };

    case 'rps':
      return {
        name: 'rps',
        score: { player: 0, ai: 0, draws: 0 },
        status: 'playing',
        lastMessage: 'Choose: rock (r), paper (p), or scissors (s):'
      };

    case 'typeracer':
    case 'speedtype': {
      const prompt = TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)];
      return {
        name: 'typeracer',
        prompt,
        startTime: Date.now(),
        status: 'playing',
        lastMessage: `Type the exact text below as fast as you can:`
      };
    }

    case 'hangman': {
      let pool = TECH_WORDS;
      if (args && args.length > 0) {
        const filterTerm = args[0].toLowerCase().trim();
        const filtered = TECH_WORDS.filter(w =>
          w.category.toLowerCase().includes(filterTerm) ||
          w.difficulty.toLowerCase().includes(filterTerm) ||
          w.word.toLowerCase() === filterTerm
        );
        if (filtered.length > 0) {
          pool = filtered;
        }
      }
      const item = pool[Math.floor(Math.random() * pool.length)];
      return {
        name: 'hangman',
        word: item.word,
        hint: item.hint,
        category: item.category,
        difficulty: item.difficulty,
        keyPoints: item.keyPoints,
        guessed: [],
        lives: 6,
        status: 'playing',
        lastMessage: 'Guess a letter (A-Z):'
      };
    }

    case 'bingo':
      return initBingo();

    default:
      return null;
  }
};

/**
 * Renders the introductory screen for starting a game.
 */
export const getGameIntro = (gameState) => {
  const lines = [];

  if (gameState.name === 'tictactoe') {
    lines.push('🎮 ==========================================');
    lines.push('❌ ⭕ TIC-TAC-TOE — TERMINAL EDITION ⭕ ❌');
    lines.push('========================================== 🎮');
    lines.push('Instructions: Enter numbers 1-9 corresponding to board positions:');
    lines.push(' 1 | 2 | 3 ');
    lines.push('---+---+---');
    lines.push(' 4 | 5 | 6 ');
    lines.push('---+---+---');
    lines.push(' 7 | 8 | 9 ');
    lines.push('Type "quit" or "exit" anytime to stop. Type "reset" for a new match.');
    lines.push('------------------------------------------');
    lines.push(renderTTTBoard(gameState.board));
    lines.push(gameState.lastMessage);
  } else if (gameState.name === 'guess') {
    lines.push('🎮 ==========================================');
    lines.push('🎯 NUMBER GUESSING GAME — TERMINAL EDITION 🎯');
    lines.push('========================================== 🎮');
    lines.push('Rules: Guess the hidden number between 1 and 100.');
    lines.push('Type "quit" or "exit" to leave, or "reset" for a new number.');
    lines.push('------------------------------------------');
    lines.push(gameState.lastMessage);
  } else if (gameState.name === 'rps') {
    lines.push('🎮 ==========================================');
    lines.push('🪨 📄 ✂️ ROCK PAPER SCISSORS — CHAMPIONSHIP ✂️ 📄 🪨');
    lines.push('========================================== 🎮');
    lines.push('Controls: type "rock" (r), "paper" (p), or "scissors" (s).');
    lines.push('Type "quit" to exit game mode.');
    lines.push('------------------------------------------');
    lines.push(gameState.lastMessage);
  } else if (gameState.name === 'typeracer') {
    lines.push('🎮 ==========================================');
    lines.push('⌨️ TYPE RACER — SPEED TYPING CHALLENGE ⚡');
    lines.push('========================================== 🎮');
    lines.push('Type the exact code snippet shown below as fast and accurately as possible!');
    lines.push('Type "quit" to stop.');
    lines.push('------------------------------------------');
    lines.push(`PROMPT: "${gameState.prompt}"`);
    lines.push('------------------------------------------');
  } else if (gameState.name === 'hangman') {
    lines.push('🎮 ===================================================');
    lines.push('🔤 TECH HANGMAN — EDUCATIONAL EDITION 🔤');
    lines.push('=================================================== 🎮');
    lines.push('Guess the hidden tech keyword letter by letter using the descriptive hint!');
    lines.push('Learn SQL, Java, Python, Databases & Core CS concepts with post-game key points!');
    lines.push('Filter topics: "hangman sql" | "hangman java" | "hangman python" | "hangman db"');
    lines.push('Type "quit" to exit or "reset" for another word.');
    lines.push('---------------------------------------------------');
    lines.push(renderHangmanState(gameState));
    lines.push(gameState.lastMessage);
  } else if (gameState.name === 'bingo') {
    lines.push('🎮 ==============================================');
    lines.push('🎰 TERMINAL BINGO (1-25) — PLAYER VS BOT 🎰');
    lines.push('============================================== 🎮');
    lines.push('Rules: Complete 5 lines (rows, columns, or diagonals) to hit BINGO!');
    lines.push('Controls: Type any number (1-25) to call it, or press Enter/"draw" to auto-draw.');
    lines.push('Every turn, both You and the Bot call numbers from the pool!');
    lines.push('The Bot\'s card is hidden 🔒 — track its B-I-N-G-O line progress live!');
    lines.push('Matched numbers are marked with red strikethrough (<cut>XX</cut>).');
    lines.push('Type "quit" to leave, or "reset" for a new game.');
    lines.push('----------------------------------------------');
    lines.push(renderBingoBoard(gameState));
    lines.push(gameState.lastMessage);
  }

  return lines;
};

/**
 * Main game loop processor for user inputs during an active game session.
 * Returns { outputLines: Array, nextState: Object | null }
 */
export const processGameInput = (inputStr, gameState) => {
  const input = inputStr.trim();
  const lower = input.toLowerCase();

  if (lower === 'quit' || lower === 'exit') {
    return {
      outputLines: ['👋 Game session ended. Returning to terminal shell.', ' '],
      nextState: null
    };
  }

  if (lower === 'reset' || lower === 'restart') {
    const resetState = initGame(gameState.name);
    return {
      outputLines: ['🔄 Game reset! Starting fresh round.', ...getGameIntro(resetState)],
      nextState: resetState
    };
  }

  switch (gameState.name) {
    case 'tictactoe':
      return handleTTTMove(input, gameState);
    case 'guess':
      return handleGuessMove(input, gameState);
    case 'rps':
      return handleRPSMove(input, gameState);
    case 'typeracer':
      return handleTypeRacerMove(input, gameState);
    case 'hangman':
      return handleHangmanMove(input, gameState);
    case 'bingo':
      return handleBingoMove(input, gameState);
    default:
      return { outputLines: ['Unknown game mode.'], nextState: null };
  }
};

/* ==========================================================================
   TIC-TAC-TOE GAME ENGINE
   ========================================================================== */
function renderTTTBoard(board) {
  const symbol = (val, pos) => (val === 'X' ? '❌' : val === 'O' ? '⭕' : ` ${pos} `);
  const row1 = ` ${symbol(board[0], 1)} | ${symbol(board[1], 2)} | ${symbol(board[2], 3)} `;
  const row2 = ` ${symbol(board[3], 4)} | ${symbol(board[4], 5)} | ${symbol(board[5], 6)} `;
  const row3 = ` ${symbol(board[6], 7)} | ${symbol(board[7], 8)} | ${symbol(board[8], 9)} `;
  return `${row1}\n---+---+---\n${row2}\n---+---+---\n${row3}`;
}

function checkTTTWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)) return 'TIE';
  return null;
}

function getAIMove(board) {
  // 1. Can AI win in 1 move?
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const copy = [...board];
      copy[i] = 'O';
      if (checkTTTWinner(copy) === 'O') return i;
    }
  }
  // 2. Block player win in 1 move
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const copy = [...board];
      copy[i] = 'X';
      if (checkTTTWinner(copy) === 'X') return i;
    }
  }
  // 3. Take center if open
  if (board[4] === null) return 4;
  // 4. Random available
  const available = board.map((v, i) => (v === null ? i : null)).filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function handleTTTMove(input, gameState) {
  const pos = parseInt(input, 10);
  if (isNaN(pos) || pos < 1 || pos > 9) {
    return {
      outputLines: ['⚠️ Invalid input! Enter a position number from 1 to 9 (or "quit"):'],
      nextState: gameState
    };
  }

  const idx = pos - 1;
  if (gameState.board[idx] !== null) {
    return {
      outputLines: ['⚠️ That spot is already taken! Choose an empty spot (1-9):'],
      nextState: gameState
    };
  }

  const newBoard = [...gameState.board];
  newBoard[idx] = 'X';

  let winner = checkTTTWinner(newBoard);
  let nextScore = { ...gameState.score };

  if (winner) {
    if (winner === 'X') nextScore.player += 1;
    else if (winner === 'TIE') nextScore.ties += 1;

    const banner = winner === 'X'
      ? '🎉 VICTORY! You defeated the AI! 🏆'
      : '🤝 IT\'S A TIE! Great game!';
    
    return {
      outputLines: [
        renderTTTBoard(newBoard),
        '------------------------------------------',
        banner,
        `[ SCORE — You: ${nextScore.player} | AI: ${nextScore.ai} | Ties: ${nextScore.ties} ]`,
        'Type "reset" to play another round, or "quit" to exit.'
      ],
      nextState: { ...gameState, board: newBoard, score: nextScore, status: 'ended' }
    };
  }

  // AI Move
  const aiIdx = getAIMove(newBoard);
  if (aiIdx !== undefined) {
    newBoard[aiIdx] = 'O';
  }

  winner = checkTTTWinner(newBoard);
  if (winner) {
    if (winner === 'O') nextScore.ai += 1;
    else if (winner === 'TIE') nextScore.ties += 1;

    const banner = winner === 'O'
      ? '🤖 AI WINS! Better luck next time!'
      : '🤝 IT\'S A TIE! Great game!';

    return {
      outputLines: [
        renderTTTBoard(newBoard),
        '------------------------------------------',
        banner,
        `[ SCORE — You: ${nextScore.player} | AI: ${nextScore.ai} | Ties: ${nextScore.ties} ]`,
        'Type "reset" to play another round, or "quit" to exit.'
      ],
      nextState: { ...gameState, board: newBoard, score: nextScore, status: 'ended' }
    };
  }

  return {
    outputLines: [
      renderTTTBoard(newBoard),
      '------------------------------------------',
      'AI made its move ⭕. Your turn (1-9):'
    ],
    nextState: { ...gameState, board: newBoard }
  };
}

/* ==========================================================================
   NUMBER GUESSING GAME ENGINE
   ========================================================================== */
function handleGuessMove(input, gameState) {
  const num = parseInt(input, 10);
  if (isNaN(num)) {
    return {
      outputLines: ['⚠️ Please enter a valid number between 1 and 100:'],
      nextState: gameState
    };
  }

  const attempts = gameState.attempts + 1;

  if (num === gameState.target) {
    return {
      outputLines: [
        '🎉 ==========================================',
        `🌟 BINGO! You guessed the number ${gameState.target} correctly! 🌟`,
        `Total Attempts: ${attempts}`,
        '========================================== 🎉',
        'Type "reset" to play again, or "quit" to exit.'
      ],
      nextState: { ...gameState, status: 'ended', attempts }
    };
  }

  const diff = Math.abs(num - gameState.target);
  let hint = num < gameState.target ? '📉 Too LOW! Try a higher number.' : '📈 Too HIGH! Try a lower number.';
  if (diff <= 3) {
    hint += ' 🔥 EXTREMELY HOT! (Within 3 numbers)';
  } else if (diff <= 10) {
    hint += ' 🌡️ WARM! (Within 10 numbers)';
  }

  return {
    outputLines: [
      `Attempt #${attempts}: ${num} -> ${hint}`,
      'Enter your next guess:'
    ],
    nextState: { ...gameState, attempts }
  };
}

/* ==========================================================================
   ROCK PAPER SCISSORS GAME ENGINE
   ========================================================================== */
function handleRPSMove(input, gameState) {
  const lower = input.toLowerCase();
  let playerChoice = '';
  if (lower === 'r' || lower === 'rock') playerChoice = 'rock';
  else if (lower === 'p' || lower === 'paper') playerChoice = 'paper';
  else if (lower === 's' || lower === 'scissors') playerChoice = 'scissors';
  else {
    return {
      outputLines: ['⚠️ Invalid move! Please choose "rock" (r), "paper" (p), or "scissors" (s):'],
      nextState: gameState
    };
  }

  const choices = ['rock', 'paper', 'scissors'];
  const aiChoice = choices[Math.floor(Math.random() * choices.length)];
  const icons = { rock: '🪨 Rock', paper: '📄 Paper', scissors: '✂️ Scissors' };

  let result = '';
  const score = { ...gameState.score };

  if (playerChoice === aiChoice) {
    result = '🤝 DRAW / TIE!';
    score.draws += 1;
  } else if (
    (playerChoice === 'rock' && aiChoice === 'scissors') ||
    (playerChoice === 'paper' && aiChoice === 'rock') ||
    (playerChoice === 'scissors' && aiChoice === 'paper')
  ) {
    result = '🎉 YOU WIN THIS ROUND!';
    score.player += 1;
  } else {
    result = '🤖 AI WINS THIS ROUND!';
    score.ai += 1;
  }

  return {
    outputLines: [
      `You played:         ${icons[playerChoice]}`,
      `PortfolioOS played: ${icons[aiChoice]}`,
      `Outcome:            ${result}`,
      `[ TOTAL SCORE — You: ${score.player} | AI: ${score.ai} | Draws: ${score.draws} ]`,
      '------------------------------------------',
      'Play again! Choose rock (r), paper (p), or scissors (s) (or "quit"): '
    ],
    nextState: { ...gameState, score }
  };
}

/* ==========================================================================
   TYPE RACER GAME ENGINE
   ========================================================================== */
function handleTypeRacerMove(input, gameState) {
  const durationSec = (Date.now() - gameState.startTime) / 1000;
  const wordCount = gameState.prompt.split(/\s+/).length;
  const wpm = Math.round((wordCount / durationSec) * 60);

  // Compare similarity
  const promptChars = gameState.prompt.split('');
  const inputChars = input.split('');
  let correct = 0;
  promptChars.forEach((ch, idx) => {
    if (inputChars[idx] === ch) correct++;
  });
  const accuracy = Math.round((correct / promptChars.length) * 100);

  let rank = '🐢 Turtle Typer';
  if (wpm > 70 && accuracy >= 90) rank = '🚀 Cyber Ninja Typer';
  else if (wpm > 45 && accuracy >= 85) rank = '⚡ Speed Demon Typer';
  else if (wpm > 25) rank = '💻 Skilled Developer Typer';

  return {
    outputLines: [
      '🏁 ==========================================',
      `RESULT: Finished in ${durationSec.toFixed(1)} seconds!`,
      `⚡ WPM (Words Per Min): ${wpm}`,
      `🎯 Accuracy:            ${accuracy}%`,
      `🏆 Rank Rating:        ${rank}`,
      '========================================== 🏁',
      'Type "reset" to try another prompt, or "quit" to exit.'
    ],
    nextState: { ...gameState, status: 'ended' }
  };
}

/* ==========================================================================
   TECH HANGMAN GAME ENGINE
   ========================================================================== */
function renderHangmanState(gameState) {
  const { word, hint, category, difficulty, guessed, lives } = gameState;
  const displayWord = word
    .split('')
    .map(ch => (guessed.includes(ch) ? ch : '_'))
    .join(' ');
  const hearts = '❤️ '.repeat(lives) + '🖤 '.repeat(6 - lives);
  const guessedStr = guessed.length > 0 ? guessed.join(', ') : 'None';
  const catBadge = category && difficulty ? `🏷️ Category: ${category} [${difficulty}]` : '';
  return `💡 HINT: ${hint}\n${catBadge}\nWord: ${displayWord}\nLives: ${hearts}\nGuessed: ${guessedStr}`;
}

function handleHangmanMove(input, gameState) {
  const char = input.toUpperCase().trim();
  if (char.length !== 1 || !/[A-Z]/.test(char)) {
    return {
      outputLines: ['⚠️ Please guess a single letter from A to Z:'],
      nextState: gameState
    };
  }

  if (gameState.guessed.includes(char)) {
    return {
      outputLines: [`⚠️ You already guessed letter "${char}". Try another letter:`],
      nextState: gameState
    };
  }

  const nextGuessed = [...gameState.guessed, char];
  let nextLives = gameState.lives;
  if (!gameState.word.includes(char)) {
    nextLives -= 1;
  }

  const isWon = gameState.word.split('').every(c => nextGuessed.includes(c));
  const isLost = nextLives <= 0;

  const nextState = { ...gameState, guessed: nextGuessed, lives: nextLives };
  const rendered = renderHangmanState(nextState);

  if (isWon) {
    const keyPointLines = (gameState.keyPoints || []).map(kp => `  • ${kp}`);
    return {
      outputLines: [
        rendered,
        '---------------------------------------------------',
        `🎉 CONGRATULATIONS! You revealed "${gameState.word}"! 🏆`,
        `🏷️ ${gameState.category || 'Tech'} [${gameState.difficulty || 'General'}]`,
        ' ',
        '📚 TECH TAKEAWAYS & KEY POINTS:',
        ...keyPointLines,
        '---------------------------------------------------',
        'Type "reset" for a new word, or "quit" to exit.'
      ],
      nextState: { ...nextState, status: 'ended' }
    };
  }

  if (isLost) {
    const keyPointLines = (gameState.keyPoints || []).map(kp => `  • ${kp}`);
    return {
      outputLines: [
        rendered,
        '---------------------------------------------------',
        `💀 GAME OVER! The secret word was "${gameState.word}".`,
        `🏷️ ${gameState.category || 'Tech'} [${gameState.difficulty || 'General'}]`,
        ' ',
        '📚 TECH TAKEAWAYS & KEY POINTS:',
        ...keyPointLines,
        '---------------------------------------------------',
        'Type "reset" to try again, or "quit" to exit.'
      ],
      nextState: { ...nextState, status: 'ended' }
    };
  }

  return {
    outputLines: [
      rendered,
      '---------------------------------------------------',
      'Guess another letter (or "quit"): '
    ],
    nextState
  };
}

/* ==========================================================================
   TERMINAL BINGO GAME ENGINE (1-25 Range, Player vs Bot, 5x5 Shuffled Grids)
   ========================================================================== */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function create5x5Grid() {
  const numbers = shuffleArray(Array.from({ length: 25 }, (_, i) => i + 1));
  const board = [];
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      row.push({ val: numbers[r * 5 + c], marked: false });
    }
    board.push(row);
  }
  return board;
}

function initBingo() {
  const playerBoard = create5x5Grid();
  const botBoard = create5x5Grid();
  const pool = Array.from({ length: 25 }, (_, i) => i + 1);

  return {
    name: 'bingo',
    playerBoard,
    botBoard,
    pool,
    calledNumbers: [],
    lastPlayerCall: null,
    lastBotCall: null,
    playerLines: 0,
    botLines: 0,
    status: 'playing',
    lastMessage: 'Call a number (1-25) or hit Enter/"draw" to auto-pick:'
  };
}

function checkBingoLines(board) {
  let lines = 0;
  // Rows
  for (let r = 0; r < 5; r++) {
    if (board[r].every(cell => cell.marked)) lines++;
  }
  // Cols
  for (let c = 0; c < 5; c++) {
    let colFull = true;
    for (let r = 0; r < 5; r++) {
      if (!board[r][c].marked) { colFull = false; break; }
    }
    if (colFull) lines++;
  }
  // Diag 1 (top-left to bottom-right)
  if (board[0][0].marked && board[1][1].marked && board[2][2].marked && board[3][3].marked && board[4][4].marked) {
    lines++;
  }
  // Diag 2 (top-right to bottom-left)
  if (board[0][4].marked && board[1][3].marked && board[2][2].marked && board[3][1].marked && board[4][0].marked) {
    lines++;
  }
  return lines;
}

function getBingoProgressStr(linesCount) {
  const letters = ['B', 'I', 'N', 'G', 'O'];
  return letters.map((l, i) => {
    if (i < linesCount) return `<gold>${l}</gold>`;
    return `<accent>_</accent>`;
  }).join(' ');
}

function renderSingleGridRow(rowCells) {
  return '│ ' + rowCells.map(cell => {
    const numStr = String(cell.val).padStart(2, '0');
    if (cell.marked) {
      return `<cut>${numStr}</cut>`;
    }
    return `<cyan>${numStr}</cyan>`;
  }).join(' │ ') + ' │';
}

function renderBingoBoard(gameState) {
  const { playerBoard, playerLines, botLines, lastPlayerCall, lastBotCall } = gameState;

  const topBorder = '┌────┬────┬────┬────┬────┐';
  const midBorder = '├────┼────┼────┼────┼────┤';
  const botBorder = '└────┴────┴────┴────┴────┘';

  const pProgress = getBingoProgressStr(playerLines);
  const bProgress = getBingoProgressStr(botLines);

  const header = `  👤 YOUR BINGO CARD (${playerLines}/5 Lines)\n  Your Progress: ${pProgress}`;

  const rows = [];
  rows.push(`  ${topBorder}`);

  for (let r = 0; r < 5; r++) {
    const pRow = renderSingleGridRow(playerBoard[r]);
    rows.push(`  ${pRow}`);
    if (r < 4) {
      rows.push(`  ${midBorder}`);
    }
  }
  rows.push(`  ${botBorder}`);

  const botStatus = `  🤖 BOT STATUS (Hidden Card 🔒)\n  Bot Progress:  ${bProgress} (${botLines}/5 Lines)`;

  const pCallStr = lastPlayerCall ? `👤 You called: <cyan>${String(lastPlayerCall).padStart(2, '0')}</cyan>` : '👤 You: None';
  const bCallStr = lastBotCall ? `🤖 Bot called: <gold>${String(lastBotCall).padStart(2, '0')}</gold>` : '🤖 Bot: None';
  const footer = `${pCallStr}  |  ${bCallStr}  |  Pool Left: <accent>${gameState.pool.length}/25</accent>`;

  return `${header}\n\n${rows.join('\n')}\n\n${botStatus}\n------------------------------------------------\n${footer}`;
}

function pickBotStrategicNumber(botBoard, pool) {
  if (pool.length === 0) return null;

  let bestNum = pool[0];
  let maxScore = -1;

  for (const num of pool) {
    let score = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (botBoard[r][c].val === num) {
          const rowMarked = botBoard[r].filter(cell => cell.marked).length;
          const colMarked = botBoard.map(row => row[c]).filter(cell => cell.marked).length;
          let diag1Marked = 0;
          if (r === c) {
            diag1Marked = [0,1,2,3,4].filter(i => botBoard[i][i].marked).length;
          }
          let diag2Marked = 0;
          if (r + c === 4) {
            diag2Marked = [0,1,2,3,4].filter(i => botBoard[i][4-i].marked).length;
          }
          score = rowMarked + colMarked + diag1Marked + diag2Marked;
        }
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestNum = num;
    }
  }

  return bestNum;
}

function handleBingoMove(input, gameState) {
  const lower = input.toLowerCase().trim();
  let playerNum = null;

  if (lower === 'draw' || lower === 'd' || lower === '' || lower === 'next') {
    if (gameState.pool.length === 0) {
      return {
        outputLines: [
          renderBingoBoard(gameState),
          '------------------------------------------------',
          '⚠️ All 25 numbers have been drawn!',
          'Type "reset" for a new game or "quit" to exit.'
        ],
        nextState: { ...gameState, status: 'ended' }
      };
    }
    const randIdx = Math.floor(Math.random() * gameState.pool.length);
    playerNum = gameState.pool[randIdx];
  } else {
    const num = parseInt(lower, 10);
    if (isNaN(num) || num < 1 || num > 25) {
      return {
        outputLines: [
          '⚠️ Invalid number! Call a number between 1 and 25, or press Enter to auto-pick:'
        ],
        nextState: gameState
      };
    }
    if (gameState.calledNumbers.includes(num)) {
      return {
        outputLines: [
          `⚠️ Number ${num} has already been called! Pick an uncalled number (1-25) or press Enter:`
        ],
        nextState: gameState
      };
    }
    playerNum = num;
  }

  // 1. Process player pick
  let currentPool = gameState.pool.filter(n => n !== playerNum);
  const nextCalled = [...gameState.calledNumbers, playerNum];

  let nextPlayerBoard = gameState.playerBoard.map(row =>
    row.map(cell => (cell.val === playerNum ? { ...cell, marked: true } : cell))
  );
  let nextBotBoard = gameState.botBoard.map(row =>
    row.map(cell => (cell.val === playerNum ? { ...cell, marked: true } : cell))
  );

  // 2. Process bot pick
  let botNum = null;
  if (currentPool.length > 0) {
    botNum = pickBotStrategicNumber(nextBotBoard, currentPool);
    currentPool = currentPool.filter(n => n !== botNum);
    nextCalled.push(botNum);

    nextPlayerBoard = nextPlayerBoard.map(row =>
      row.map(cell => (cell.val === botNum ? { ...cell, marked: true } : cell))
    );
    nextBotBoard = nextBotBoard.map(row =>
      row.map(cell => (cell.val === botNum ? { ...cell, marked: true } : cell))
    );
  }

  const pLines = checkBingoLines(nextPlayerBoard);
  const bLines = checkBingoLines(nextBotBoard);

  const pMsg = `👤 YOU CALLED: <cyan>${String(playerNum).padStart(2, '0')}</cyan>`;
  const bMsg = botNum ? `🤖 BOT CALLED: <gold>${String(botNum).padStart(2, '0')}</gold>` : '';

  const nextState = {
    ...gameState,
    playerBoard: nextPlayerBoard,
    botBoard: nextBotBoard,
    pool: currentPool,
    calledNumbers: nextCalled,
    lastPlayerCall: playerNum,
    lastBotCall: botNum,
    playerLines: pLines,
    botLines: bLines
  };

  const renderedBoard = renderBingoBoard(nextState);

  // Check game end conditions
  if (pLines >= 5 || bLines >= 5) {
    let resultMsg = '';
    if (pLines >= 5 && bLines >= 5) {
      resultMsg = '🤝 IT\'S A DRAW! Both You and Bot completed 5 lines on the same turn!';
    } else if (pLines >= 5) {
      resultMsg = '🎉🎉 B-I-N-G-O! YOU WIN! YOU COMPLETED 5 LINES FIRST! 🏆🏆';
    } else {
      resultMsg = '🤖 B-I-N-G-O! BOT WINS! The Bot completed 5 lines first! 💻';
    }

    return {
      outputLines: [
        pMsg,
        ...(bMsg ? [bMsg] : []),
        renderedBoard,
        '------------------------------------------------',
        resultMsg,
        `Total calls made: ${nextCalled.length}/25`,
        'Type "reset" for a new game, or "quit" to exit.'
      ],
      nextState: { ...nextState, status: 'ended' }
    };
  }

  if (currentPool.length === 0) {
    return {
      outputLines: [
        pMsg,
        ...(bMsg ? [bMsg] : []),
        renderedBoard,
        '------------------------------------------------',
        '🏁 All 25 numbers called! No player reached 5 lines.',
        'Type "reset" for a new game, or "quit" to exit.'
      ],
      nextState: { ...nextState, status: 'ended' }
    };
  }

  return {
    outputLines: [
      pMsg,
      ...(bMsg ? [bMsg] : []),
      renderedBoard,
      '------------------------------------------------',
      'Call next number (1-25) or press Enter to auto-draw:'
    ],
    nextState
  };
}
