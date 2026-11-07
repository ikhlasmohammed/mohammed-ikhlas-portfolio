import { useEffect, useRef, useState } from "react"

type Screenshot = { src: string; alt: string; label: string }

function assetUrl(path: string) {
  const assetPath = path.replace(/^\/+/, "")
  if (import.meta.env.PROD) {
    return `https://raw.githubusercontent.com/ikhlasmohammed/mohammed-ikhlas-portfolio/gh-pages/${assetPath}`
  }
  return `${import.meta.env.BASE_URL}${assetPath}`
}

type Project = {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  description: string
  tools: string[]
  problem: string
  built: string
  result: string
  caseStudy: string
  subject: string
  role: string
  preview: Screenshot
  externalLink?: string
  externalLabel?: string
  screenshots?: Screenshot[]
}

const projects: Project[] = [
  {
    id: "01",
    slug: "calory",
    title: "Calory.AI",
    category: "Computer vision",
    summary: "I built a cloud-based meal tracker around food image recognition.",
    description:
      "I built the AWS workflow behind a meal photo classifier, calorie tracker and daily-goal system.",
    tools: ["AWS", "Rekognition", "Lambda", "Cognito", "RDS", "DynamoDB"],
    problem:
      "I wanted to reduce the effort of logging meals, but the app still needed to keep each user’s goal and meal history consistent.",
    built:
      "I connected S3, CloudFront, Cognito, API Gateway, Lambda, Rekognition Custom Labels, RDS, DynamoDB and SNS into one workflow.",
    result:
      "I fixed the goal-persistence and Singapore-time bugs, and built a working flow from signup to food recognition, meal logging and goal notifications.",
    caseStudy:
      "I built Calory.AI for my Cloud Technologies for AI module. The main flow starts when a user uploads a meal photo. Rekognition Custom Labels identifies whether it is pizza, a burger or crispy chicken, RDS provides the calorie and macro information, and Lambda saves the meal through API Gateway. I used Cognito for signup, email verification and login, S3 and CloudFront for the frontend, DynamoDB for daily goal status, and SNS to notify a user when the goal is reached. The difficult part was not just connecting the services; it was tracing bugs across them. The calorie goal collected during signup was silently dropped because it was never sent to the backend, while login replaced it with a hardcoded value. I fixed this by adding a Cognito custom attribute and changing both signup and login to persist and return it. I also corrected date calculations because Lambda runs in UTC and was producing the wrong 'today' total near midnight in Singapore. API Gateway changes also needed a manual stage redeploy and an explicit Lambda permission for apigateway.amazonaws.com. I used curl to separate backend problems from browser CORS errors. Finally, I learned to start Rekognition Custom Labels only when testing and stop it immediately afterwards because it bills hourly.",
    subject: "Cloud Technologies for AI",
    role: "Cloud application developer",
    preview: {
      src: "/images/calory/analysis.png",
      alt: "Calory.AI meal analysis screen",
      label: "Meal analysis",
    },
    externalLink: "https://youtu.be/g3XfARyloAE",
    externalLabel: "Watch demo",
    screenshots: [
      {
        src: "/images/calory/home.png",
        alt: "Calory.AI home dashboard",
        label: "Dashboard",
      },
      {
        src: "/images/calory/dashboard.png",
        alt: "Calory.AI dashboard showing daily nutrition summary",
        label: "Daily overview",
      },
      {
        src: "/images/calory/profile.png",
        alt: "Calory.AI profile and login screen",
        label: "Account",
      },
      {
        src: "/images/calory/snap-meal.png",
        alt: "Calory.AI Snap Your Meal upload screen",
        label: "Snap a meal",
      },
      {
        src: "/images/calory/analysis.png",
        alt: "Calory.AI meal analysis results",
        label: "Analysis results",
      },
      {
        src: "/images/calory/diary.png",
        alt: "Calory.AI food diary showing logged meals",
        label: "Food diary",
      },
    ],
  },
  {
    id: "02",
    slug: "valu",
    title: "Valu.AI",
    category: "Machine learning",
    summary: "I built an HDB resale estimator and tested which model actually worked best.",
    description:
      "A machine learning project where I handled the data, model comparison and Streamlit app myself.",
    tools: ["Python", "scikit-learn", "Pandas", "Random Forest"],
    problem:
      "HDB prices depend on several connected factors, and a model can look accurate while still being inconsistent when it is used inside an app.",
    built:
      "I filtered 2025-2026 data, sampled 5,000 rows by town, engineered features, compared three models and reproduced the preprocessing in Streamlit.",
    result:
      "Log-transformed Linear Regression reached an R-squared of 0.908 and an RMSE of $59,812, so I chose it over the more complex alternatives.",
    caseStudy:
      "I built Valu.AI from start to finish for my Machine Learning for Developers module. I filtered the HDB resale data to 2025 and 2026, kept 3-, 4- and 5-room flats, and took a stratified sample of 5,000 rows by town. I removed block and street name because their high number of unique values did not give the model useful general patterns. I converted the remaining lease to months, encoded storey as an ordered number, and split the data before encoding so the test set stayed clean. The biggest improvement came from log-transforming price: RMSE fell from $70,402 to $59,812. I compared Linear Regression, a Random Forest tuned with RandomizedSearchCV, and Gradient Boosting. Linear Regression on log price won with an R-squared of 0.908. I chose it even though Random Forest had a slightly better MAE because RMSE penalises large mistakes more heavily and the simpler model was easier to deploy. In the Streamlit app, I built the input form, prediction display, market-context chart and comparable-sales list. I found a bug where pd.get_dummies on one row produced all-zero columns when drop_first=True, so I set the app columns explicitly. I also had to keep the lease-date calculation and log1p/expm1 steps identical between the notebook and app. The main lesson was that a good notebook result is not enough; the deployed preprocessing must match exactly.",
    subject: "Machine Learning for Developers",
    role: "Machine learning developer",
    preview: {
      src: "/images/valu/estimate.png",
      alt: "Valu.AI estimated resale price screen",
      label: "Price estimate",
    },
    externalLink:
      "https://hdb-resale-price-predictor-ff6xhp8c2v6xa6xgf2qxtv.streamlit.app",
    externalLabel: "Live demo",
    screenshots: [
      {
        src: "/images/valu/estimator.png",
        alt: "Valu.AI HDB resale estimator form",
        label: "Property inputs",
      },
      {
        src: "/images/valu/estimate.png",
        alt: "Valu.AI estimated resale price and market context",
        label: "Price estimate",
      },
      {
        src: "/images/valu/comparables.png",
        alt: "Valu.AI comparable resale transactions and estimate explanation",
        label: "Market comparables",
      },
    ],
  },
  {
    id: "03",
    slug: "audit",
    title: "AuditXpress",
    category: "Process automation",
    summary: "I built an unattended expense-auditing workflow with clear records.",
    description:
      "An end-to-end UiPath robot that extracts claims, applies policy rules and separates approved and rejected outcomes.",
    tools: ["UiPath", "OCR", "Regex", "Python", "Outlook", "Excel"],
    problem:
      "Expense claims arrived in different formats, so the robot had to extract reliable values before it could apply any policy.",
    built:
      "I routed native PDFs and receipt images through different extraction paths, validated the fields in Python, and wrote the results to Outlook and Excel.",
    result:
      "The robot can complete an unattended run, reject invalid claims with a dynamic email, and keep both a payment batch and master audit log.",
    caseStudy:
      "I implemented the entire AuditXpress architecture, from email ingestion to the final Excel reports, for my Robotic Process Automation module. Because claims arrived as both PDFs and physical receipt images, I created a dual-path workflow: native PDFs went through a text reader, while images went through AI-powered OCR. OCR output was inconsistent, so I spent time tuning Regex patterns for the transaction date, amount and merchant. I kept the policy logic in audit_logic.py instead of putting every rule inside UiPath, then converted UiPath strings into floats and datetime values before calling evaluate_claim. Office 365 authentication caused problems for unattended execution, so I switched to classic email activities to avoid manual login interruptions. I also used nested Try-Catch blocks so one invalid claim could trigger a rejection email and update the Master Audit Log without stopping the Payment Batch process. UiPath Orchestrator then ran the workflow unattended and confirmed the completed job.",
    subject: "Robotic Process Automation",
    role: "Automation developer",
    preview: {
      src: "/images/audit/python-evaluation.png",
      alt: "AuditXpress policy evaluation workflow",
      label: "Policy evaluation",
    },
    externalLink: "https://www.youtube.com/watch?v=rDhw6yME-uc&feature=youtu.be",
    externalLabel: "Watch demo",
    screenshots: [
      {
        src: "/images/audit/pdf-extraction.png",
        alt: "AuditXpress UiPath PDF extraction workflow",
        label: "PDF extraction",
      },
      {
        src: "/images/audit/ocr-extraction.png",
        alt: "AuditXpress OCR extraction workflow for image receipts",
        label: "OCR fallback",
      },
      {
        src: "/images/audit/python-evaluation.png",
        alt: "AuditXpress Python evaluation workflow",
        label: "Policy evaluation",
      },
      {
        src: "/images/audit/rejection-email.png",
        alt: "AuditXpress automated rejection email configuration",
        label: "Outcome notification",
      },
      {
        src: "/images/audit/audit-log.png",
        alt: "AuditXpress master audit log Excel workflow",
        label: "Master audit log",
      },
      {
        src: "/images/audit/payment-batch.png",
        alt: "AuditXpress payment batch Excel workflow",
        label: "Payment batch",
      },
      {
        src: "/images/audit/orchestrator.png",
        alt: "AuditXpress process successfully completed in UiPath Orchestrator",
        label: "Orchestrator run",
      },
    ],
  },
  {
    id: "04",
    slug: "overload",
    title: "Overload.AI",
    category: "Mobile product",
    summary: "I built a Flutter fitness app with deterministic training advice.",
    description:
      "A Flutter app where I built workout logging, progress analysis, recommendations, authentication and navigation.",
    tools: ["Flutter", "Dart", "Firebase", "Riverpod"],
    problem:
      "The app needed to feel personalised without allowing an unreliable AI response to decide the actual workout numbers.",
    built:
      "I separated Flutter UI from business logic with Riverpod, added Firebase services, and calculated progressive overload in Dart before requesting AI explanations.",
    result:
      "The app continues to give mathematically valid recommendations when Groq is slow, rate-limited or unavailable.",
    caseStudy:
      "I worked on Overload.AI for my Mobile App Development module. I built the main Flutter experience, including onboarding, authentication, navigation, workout sessions, set logging, rest timers, charts, progress analysis and recommendations. Riverpod keeps workout logs in providers so adding, editing or deleting a set refreshes the relevant screens without manually passing data around. I put Firestore operations in service classes such as WorkoutLogService instead of placing them directly in screens, which made it easier to support real-time streams, filtered queries, sorting and aggregate queries. The main technical challenge was the progressive-overload system. Dart calculates estimated one-rep max values and decides whether to add weight or one repetition based on the user’s recent best set. Groq only explains those results in natural language; it never decides the numbers. I also batched exercises into one request to reduce API calls and added a fallback when the service fails. For realistic recommendations, I select the best set from the latest training day rather than blindly using the last set, since later sets may be lower because of fatigue.",
    subject: "Mobile App Development",
    role: "Mobile application developer",
    preview: {
      src: "/images/overload/home.png",
      alt: "Overload.AI mobile training dashboard",
      label: "Training dashboard",
    },
    externalLink: "https://youtu.be/6-4HeU2RPnE",
    externalLabel: "Watch demo",
    screenshots: [
      {
        src: "/images/overload/login.png",
        alt: "Overload.AI login screen",
        label: "Welcome",
      },
      {
        src: "/images/overload/verification-email.png",
        alt: "Overload.AI email verification screen",
        label: "Email verification",
      },
      {
        src: "/images/overload/onboarding.png",
        alt: "Overload.AI fitness onboarding form",
        label: "Personal setup",
      },
      {
        src: "/images/overload/home.png",
        alt: "Overload.AI home dashboard with workout and progress summary",
        label: "Training dashboard",
      },
      {
        src: "/images/overload/workout-session.png",
        alt: "Overload.AI push day workout session with logged sets",
        label: "Workout session",
      },
      {
        src: "/images/overload/exercise-picker.png",
        alt: "Overload.AI exercise picker",
        label: "Exercise picker",
      },
      {
        src: "/images/overload/calendar.png",
        alt: "Overload.AI workout calendar",
        label: "Workout calendar",
      },
      {
        src: "/images/overload/ai-analysis.png",
        alt: "Overload.AI coaching analysis dashboard",
        label: "AI analysis",
      },
      {
        src: "/images/overload/ai-recommendations.png",
        alt: "Overload.AI recommended next-session exercises",
        label: "AI recommendations",
      },
    ],
  },
]

const skills = [
  "Python",
  "Machine Learning",
  "UiPath",
  "AWS",
  "Flutter",
  "Firebase",
  "JavaScript",
  "SQL",
  "Git",
  "Figma",
]

function Arrow({ direction = "up" }: { direction?: "up" | "left" }) {
  return direction === "left" ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16 10H4m5-5-5 5 5 5" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  )
}

function Mark({ type }: { type: string }) {
  return (
    <div className={`project-mark mark-${type}`} aria-hidden="true">
      {type === "calory" && (
        <>
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="scan" />
          <span className="target">94%</span>
        </>
      )}
      {type === "valu" && (
        <>
          <span className="value">$568K</span>
          <svg viewBox="0 0 240 120" preserveAspectRatio="none">
            <path d="m0 103 36-20 32 8 39-39 34 15 44-50 55 14" />
          </svg>
        </>
      )}
      {type === "audit" && (
        <div className="flow">
          <span>INBOX</span>
          <i />
          <span>OCR</span>
          <i />
          <span>PASS</span>
        </div>
      )}
      {type === "overload" && (
        <div className="rep">
          <span>SET 03</span>
          <strong>65</strong>
          <small>KG · 8 REPS</small>
        </div>
      )}
    </div>
  )
}

function Header({ detail = false }: { detail?: boolean }) {
  const [activeSection, setActiveSection] = useState("work")

  useEffect(() => {
    if (detail) return
    const sections = ["work", "oceanx", "endeavour", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.6] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [detail])

  return (
    <header className="site-header">
      {!detail && (
        <nav aria-label="Primary navigation">
            <a className={activeSection === "work" ? "is-active" : ""} href="#work">Work</a>
            <a className={activeSection === "oceanx" ? "is-active" : ""} href="#oceanx">OceanX</a>
            <a className={activeSection === "endeavour" ? "is-active" : ""} href="#endeavour">Endeavour</a>
            <a className={activeSection === "contact" ? "is-active" : ""} href="#contact">Contact</a>
        </nav>
      )}
    </header>
  )
}

function ProjectDetail({
  project,
  close,
}: {
  project: Project
  close: () => void
}) {
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<Screenshot | null>(null)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!selectedScreenshot) {
      trigger?.focus()
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedScreenshot(null)
      if (event.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            ".screenshot-lightbox button",
          ),
        )
        const currentIndex = focusable.indexOf(
          document.activeElement as HTMLButtonElement,
        )
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + focusable.length) % focusable.length
          : (currentIndex + 1) % focusable.length
        event.preventDefault()
        focusable[nextIndex]?.focus()
      }
      if (!project.screenshots) return
      const currentIndex = project.screenshots.findIndex(
        (screenshot) => screenshot.src === selectedScreenshot.src,
      )
      if (event.key === "ArrowRight") {
        setSelectedScreenshot(
          project.screenshots[(currentIndex + 1) % project.screenshots.length],
        )
      }
      if (event.key === "ArrowLeft") {
        setSelectedScreenshot(
          project.screenshots[
            (currentIndex - 1 + project.screenshots.length) %
              project.screenshots.length
          ],
        )
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [project.screenshots, selectedScreenshot, trigger])

  return (
    <main className="detail-page">
      <Header detail />
      <section className="detail-hero">
        <button className="back-button" type="button" onClick={close}>
          <Arrow direction="left" /> All projects
        </button>
        <div className="detail-title">
          <div>
            <p className="eyebrow">
              {project.id} / {project.category}
            </p>
            <h1>{project.title}</h1>
          </div>
          <p>{project.description}</p>
        </div>
        <Mark type={project.slug} />
      </section>
      <section className="case-study">
        <div className="case-tools">
          <p className="eyebrow">Technology</p>
          <div>
            {project.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
        <div className="case-meta">
          <div>
            <span className="eyebrow">Course</span>
            <strong>{project.subject}</strong>
          </div>
          <div>
            <span className="eyebrow">Role</span>
            <strong>{project.role}</strong>
          </div>
          {project.externalLink && (
            <a href={project.externalLink} target="_blank" rel="noreferrer">
              {project.externalLabel} <Arrow />
            </a>
          )}
        </div>
        <div className="case-grid">
          {[
            ["The challenge", project.problem],
            ["The approach", project.built],
            ["The outcome", project.result],
          ].map(([label, text], index) => (
            <article key={label}>
              <span>0{index + 1}</span>
              <h2>{label}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <section className="case-story">
          <p className="eyebrow">The story</p>
          <p>{project.caseStudy}</p>
        </section>
        {project.screenshots && (
          <section className="project-screens" aria-label={`${project.title} screens`}>
            <div className="project-screens-intro">
              <p className="eyebrow">Product screens</p>
              <p>
                {project.slug === "calory"
                  ? "From snapping a meal to reviewing a complete nutrition diary."
                  : project.slug === "valu"
                    ? "From property inputs to a transparent estimate backed by comparable sales."
                    : project.slug === "audit"
                      ? "From document extraction to policy evaluation, notifications and audit-ready records."
                      : "From onboarding and workout logging to calendar planning and AI coaching."}
              </p>
            </div>
            <div className={`project-screens-grid project-screens-grid-${project.slug}`}>
              {project.screenshots.map((screenshot) => (
                <figure key={screenshot.src}>
                  <button
                    className="screenshot-button"
                    type="button"
                    onClick={(event) => {
                      setTrigger(event.currentTarget)
                      setSelectedScreenshot(screenshot)
                    }}
                    aria-label={`View ${screenshot.label} screenshot`}
                  >
                    <img
                      src={assetUrl(screenshot.src)}
                      alt={screenshot.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <figcaption>{screenshot.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </section>
      {selectedScreenshot && (
        <div
          className="screenshot-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedScreenshot.label} enlarged screenshot`}
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="lightbox-nav lightbox-prev"
              type="button"
              onClick={() => {
                if (!project.screenshots) return
                const index = project.screenshots.findIndex(
                  (screenshot) => screenshot.src === selectedScreenshot.src,
                )
                setSelectedScreenshot(
                  project.screenshots[
                    (index - 1 + project.screenshots.length) %
                      project.screenshots.length
                  ],
                )
              }}
              aria-label="Previous screenshot"
            >
              <Arrow direction="left" />
            </button>
            <button
              className="lightbox-close"
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              aria-label="Close enlarged screenshot"
            >
              ×
            </button>
            <img
              src={assetUrl(selectedScreenshot.src)}
              alt={selectedScreenshot.alt}
              decoding="async"
            />
            <div className="lightbox-caption">
              <p>{selectedScreenshot.label}</p>
              <span>
                {(project.screenshots?.findIndex(
                  (screenshot) => screenshot.src === selectedScreenshot.src,
                ) ?? 0) + 1}{" "}
                / {project.screenshots?.length}
              </span>
            </div>
            <button
              className="lightbox-nav lightbox-next"
              type="button"
              onClick={() => {
                if (!project.screenshots) return
                const index = project.screenshots.findIndex(
                  (screenshot) => screenshot.src === selectedScreenshot.src,
                )
                setSelectedScreenshot(
                  project.screenshots[(index + 1) % project.screenshots.length],
                )
              }}
              aria-label="Next screenshot"
            >
              <Arrow direction="left" />
            </button>
          </div>
        </div>
      )}
      <div className="next-project">
        <p className="eyebrow">Continue exploring</p>
        <button
          type="button"
          onClick={() => {
            const index = projects.findIndex(
              (item) => item.slug === project.slug,
            )
            openProject(projects[(index + 1) % projects.length].slug)
          }}
        >
          Next project <Arrow />
        </button>
      </div>
    </main>
  )
}

function openProject(slug: string) {
  window.location.hash = `project/${slug}`
  window.scrollTo({ top: 0, behavior: "instant" })
}

function App() {
  const getSelected = () => {
    const slug = window.location.hash.replace("#project/", "")
    return projects.find((project) => project.slug === slug) ?? null
  }
  const [selected, setSelected] = useState<Project | null>(getSelected)

  useEffect(() => {
    const onHashChange = () => setSelected(getSelected())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  if (selected) {
    return (
      <ProjectDetail
        project={selected}
        close={() => {
          window.location.hash = "work"
          window.scrollTo({ top: 0, behavior: "instant" })
        }}
      />
    )
  }

  return (
    <main>
      <Header />
      <section className="hero" id="top">
        <h1>
          I build intelligent systems that make <em>complex work</em> feel
          simple.
        </h1>
        <div className="hero-bottom">
          <p>
            I am a Year 2 Diploma in Applied AI student at Temasek Polytechnic.
            I enjoy building machine learning models, cloud applications,
            automation workflows and mobile products, then working through the
            technical problems that make them reliable.
          </p>
          <div className="hero-links">
            <a
              className="button"
              href="https://github.com/ikhlasmohammed"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
            <a
              className="button"
              href="https://www.linkedin.com/in/mohammed-ikhlas"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-intro">
          <div>
            <p className="eyebrow">01 / Selected work</p>
            <h2>Ideas, made useful.</h2>
          </div>
          <p>
            Four projects across AI, automation and product design. Select one
            to explore the case study.
          </p>
        </div>
        <div className="project-row">
          {projects.map((project) => (
            <div className="project-card-item" key={project.slug}>
              <button
                className="project-card"
                type="button"
                onClick={() => openProject(project.slug)}
              >
                <div className="card-meta">
                  <span>{project.id}</span>
                  <span>{project.category}</span>
                </div>
                <Mark type={project.slug} />
                <div className="card-copy">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="card-subject">{project.subject}</div>
                  <span className="view-project">
                    View project <Arrow />
                  </span>
                </div>
              </button>
              {project.externalLink && (
                <a
                  className="project-external-link"
                  href={project.externalLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.externalLabel} <Arrow />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="oceanx-section" id="oceanx">
        <div className="oceanx-intro">
          <div>
            <p className="eyebrow">02 / Why OceanX</p>
            <h2>Technology that makes care visible.</h2>
          </div>
          <p>
            OceanX brings together the things I care about most: technology,
            education, meaningful problem solving and real-world impact. I am
            excited by the opportunity to make ocean issues more accessible,
            personal and actionable.
          </p>
        </div>
        <div className="oceanx-grid">
          <article className="oceanx-lead">
            <span className="oceanx-number">01</span>
            <h3>From awareness to action.</h3>
            <p>
              Ocean literacy is not only about knowing facts. It is about
              helping people understand how everyday choices connect to marine
              ecosystems, climate and biodiversity. I want to explore how
              thoughtful digital experiences can make those connections easier
              to see and act on.
            </p>
          </article>
          <article>
            <span className="oceanx-number">02</span>
            <h3>What I bring.</h3>
            <p>
              As a Year 2 Diploma in Applied AI student at Temasek Polytechnic,
              I bring experience in machine learning, cloud technologies,
              automation, data analysis and user-centered software development.
              I enjoy turning complex information into intuitive applications,
              visualizations and intelligent systems.
            </p>
          </article>
          <article>
            <span className="oceanx-number">03</span>
            <h3>Built under pressure.</h3>
            <p>
              At the HKIIT International Competition 2026 in Hong Kong, my team
              built a retail demand forecasting pipeline and web application in
              two days, earning a Merit Award. I contributed to technical
              planning, machine learning development and UI/UX implementation.
            </p>
          </article>
        </div>
        <div className="oceanx-proof">
          <div>
            <p className="eyebrow">Ready to contribute</p>
            <h3>Curious, collaborative and practical.</h3>
          </div>
          <p>
            Beyond technical work, I serve as Vice President of the Applied AI
            Student Interest Group and participate in Temasek LEAD. My
            experience in NCC (Air), where I became a Master Sergeant, Parade
            Commander and Certified Mentor, has strengthened how I communicate,
            lead and support a team. I would bring that same collaborative
            mindset to an OceanX hackathon team.
          </p>
        </div>
      </section>

      <section className="endeavours-section" id="endeavour">
        <div className="endeavours-heading">
          <p className="eyebrow">03 / Recent endeavours</p>
          <h2>Places that changed how I see the world.</h2>
        </div>
        <section className="endeavour-section">
          <div className="endeavour-copy">
            <p className="eyebrow">Hong Kong and Shenzhen / 2026</p>
            <h3>Hong Kong and Shenzhen.</h3>
            <p>
              In August 2026, I joined Temasek Polytechnic’s overseas study
              trip to Hong Kong and Shenzhen. The experience brought together
              technology visits, an international competition and conversations
              with students and industry practitioners.
            </p>
            <p>
              From visiting Huawei and Lenovo to earning a Merit Award in AI
              and Analytics, the trip gave me a closer look at how ideas become
              products, and how collaboration shapes the way we learn.
            </p>
          </div>
          <div className="endeavour-gallery">
            <figure className="endeavour-feature">
              <img
                src={assetUrl("/images/hong-kong-shenzhen/huawei.jpg")}
                alt="Temasek Polytechnic students outside Huawei in Shenzhen"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Huawei, Shenzhen</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hong-kong-shenzhen/merit-award.jpg")}
                alt="Merit Award in AI and Analytics from the International Competition 2026"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Merit Award, AI and Analytics</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hong-kong-shenzhen/lenovo.jpg")}
                alt="Temasek Polytechnic students visiting Lenovo Future Centre"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Lenovo Future Centre</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hong-kong-shenzhen/competition.jpg")}
                alt="Temasek Polytechnic team at International Competition 2026"
                loading="lazy"
                decoding="async"
              />
              <figcaption>International Competition 2026</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hong-kong-shenzhen/discussion.jpg")}
                alt="Student speaking with a participant during the study trip"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Learning through conversation</figcaption>
            </figure>
          </div>
        </section>
        <section className="endeavour-section endeavour-hanoi">
          <div className="endeavour-copy">
            <p className="eyebrow">Global Studies / Hanoi, Vietnam</p>
            <h3>Hanoi, Vietnam.</h3>
            <p>
              My Global Studies trip to Hanoi offered a different kind of
              learning experience, rooted in place, people and perspective.
              Exploring the city made its history and everyday rhythm feel
              tangible, from the train tracks running through the Old Quarter
              to the energy of its busy streets at night.
            </p>
            <p>
              We also visited VSIP Bắc Ninh, where I gained a closer view of
              Vietnam’s growing industrial and business landscape. The trip
              reminded me that learning extends beyond classrooms, especially
              when new environments challenge me to observe, listen and stay
              curious.
            </p>
          </div>
          <div className="endeavour-gallery">
            <figure className="endeavour-feature">
              <img
                src={assetUrl("/images/hanoi/train-street.jpg")}
                alt="Hanoi train street in the Old Quarter"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Hanoi Train Street</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hanoi/hanoi-night.jpg")}
                alt="Hanoi street at night"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Hanoi after dark</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hanoi/vsip-bac-ninh.jpg")}
                alt="VSIP Bac Ninh sign with Singapore and Vietnam flags"
                loading="lazy"
                decoding="async"
              />
              <figcaption>VSIP Bắc Ninh</figcaption>
            </figure>
            <figure>
              <img
                src={assetUrl("/images/hanoi/global-studies.jpg")}
                alt="Students taking part in a Global Studies activity in Vietnam"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Learning together</figcaption>
            </figure>
          </div>
        </section>
      </section>

      <section className="profile-section">
        <div>
          <p className="eyebrow">04 / Capabilities</p>
          <h2>
            From model to
            <br />
            meaningful product.
          </h2>
        </div>
        <div className="skills">
          {skills.map((skill, index) => (
            <div key={skill}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section className="achievements-section" id="achievements">
        <div className="achievements-intro">
          <div>
            <p className="eyebrow">05 / Beyond the work</p>
            <h2>
              Learning by
              <br />
              taking the lead.
            </h2>
          </div>
          <p>
            Building technical depth while contributing to teams, communities
            and ambitious ideas.
          </p>
        </div>
        <div className="achievement-list">
          <article>
            <span className="achievement-marker">2026</span>
            <div>
              <p className="eyebrow">Recognition</p>
              <h3>Merit Award</h3>
              <strong>HKIIT International Competition</strong>
              <p>
                Built a stock forecasting ML pipeline and web app with a team of
                four in two days.
              </p>
            </div>
          </article>
          <article>
            <span className="achievement-marker">LEAD</span>
            <div>
              <p className="eyebrow">Leadership</p>
              <h3>Vice President</h3>
              <strong>Applied AI Student Interest Group</strong>
              <p>
                Supporting a student community through practical AI learning and
                peer-led initiatives.
              </p>
            </div>
          </article>
          <article>
            <span className="achievement-marker">10%</span>
            <div>
              <p className="eyebrow">Programme</p>
              <h3>Temasek LEAD</h3>
              <strong>Top 10% of the cohort</strong>
              <p>
                Selected for the polytechnic’s leadership development programme.
              </p>
            </div>
          </article>
        </div>
      </section>

      <footer id="contact">
        <p className="eyebrow">05 / Let’s connect</p>
        <div className="footer-main">
          <h2>
            Have an idea?
            <br />
            <em>Let’s make it real.</em>
          </h2>
          <a href="mailto:mohammed.ikhlas66@gmail.com">
            mohammed.ikhlas66@gmail.com <Arrow />
          </a>
        </div>
        <div className="footer-bottom">
          <span>Mohammed Ikhlas · Singapore</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  )
}

export default App
