import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, useGLTF, Preload, Box } from "@react-three/drei";
import { Cpu, Zap, RotateCw, Loader2, Menu, X } from "lucide-react";

/// --- CONFIGURACIÓN DE LOS LOGOS ---
// Grilla 4 columnas × 3 filas = 12 modelos perfectos
const TECH_LOGOS = [
  // Fila superior (y = 3)
  {
    id: 1,
    name: "Android",
    path: "/models/android.glb",
    color: "#3DDC84",
    position: [-4.5, 3, 0],
    description: "Desarrollo de aplicaciones móviles nativas",
  },
  {
    id: 2,
    name: "FastAPI",
    path: "/models/fastapi.glb",
    color: "#009688",
    position: [-1.5, 3, 0],
    description: "Framework web moderno y rápido para Python",
  },
  {
    id: 3,
    name: "Flutter",
    path: "/models/flutter.glb",
    color: "#02569B",
    position: [1.5, 3, 0],
    description: "Framework multiplataforma de Google",
  },
  {
    id: 4,
    name: "Java",
    path: "/models/java.glb",
    color: "#5382A1",
    position: [4.5, 3, 0],
    description: "Lenguaje robusto para aplicaciones empresariales",
  },
  // Fila media (y = 0)
  {
    id: 5,
    name: "JavaScript",
    path: "/models/javascript.glb",
    color: "#F7DF1E",
    position: [-4.5, 0, 0],
    description: "El lenguaje de la web",
  },
  {
    id: 6,
    name: "Kotlin",
    path: "/models/kotlin.glb",
    color: "#7F52FF",
    position: [-1.5, 0, 0],
    description: "Lenguaje moderno para Android y JVM",
  },
  {
    id: 7,
    name: "MySQL",
    path: "/models/mysql.glb",
    color: "#00758F",
    position: [1.5, 0, 0],
    description: "Sistema de gestión de bases de datos",
  },
  {
    id: 8,
    name: "Python",
    path: "/models/python.glb",
    color: "#3776AB",
    position: [4.5, 0, 0],
    description: "Lenguaje versátil para ciencia de datos y web",
  },
  // Fila inferior (y = -3)
  {
    id: 9,
    name: "React",
    path: "/models/react.glb",
    color: "#61DAFB",
    position: [-4.5, -3, 0],
    description: "Biblioteca para interfaces de usuario",
  },
  {
    id: 10,
    name: "SF",
    path: "/models/sf.glb",
    color: "#00A1E0",
    position: [-1.5, -3, 0],
    description: "Salesforce Platform",
  },
  {
    id: 11,
    name: "TS",
    path: "/models/tfs.glb",
    color: "#3178C6",
    position: [1.5, -3, 0],
    description: "TypeScript - JavaScript con tipos",
  },
  {
    id: 12,
    name: "JS-GLB",
    path: "/models/js.glb",
    color: "#F0DB4F",
    position: [4.5, -3, 0],
    description: "JavaScript GLB Utility",
  },
];

TECH_LOGOS.forEach((logo) => {
  useGLTF.preload(logo.path);
});

// -------------------------------------------------------------

function GLBModel({ path, position, color, onSelect, name }) {
  const groupRef = useRef();
  const [hovered, setHover] = useState(false);

  const gltf = useGLTF(path);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!gltf || !gltf.scene) {
    return (
      <FallbackModel
        position={position}
        color={color}
        name={name}
        onSelect={onSelect}
      />
    );
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={() => setHover(false)}
      onClick={onSelect}
    >
      <primitive object={gltf.scene.clone()} scale={hovered ? 1.3 : 1} />

      {hovered && (
        <>
          <pointLight
            position={[0, 2, 0]}
            intensity={2}
            color={color}
            distance={5}
          />
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.35}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="black"
          >
            {name}
          </Text>
        </>
      )}
    </group>
  );
}

function FallbackModel({ position, color, name, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group
      position={position}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={() => setHover(false)}
      onClick={onSelect}
    >
      <Box ref={meshRef} args={[1, 1, 1]} scale={hovered ? 1.3 : 1}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {hovered && (
        <>
          <pointLight
            position={[0, 2, 0]}
            intensity={2}
            color={color}
            distance={5}
          />
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.35}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="black"
          >
            {name}
          </Text>
        </>
      )}
    </group>
  );
}

// -------------------------------------------------------------

function LogoScene({ onSelect }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#4f46e5" />

      <OrbitControls
        makeDefault
        minDistance={8}
        maxDistance={20}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.3}
      />

      {TECH_LOGOS.map((logo) => (
        <Suspense
          key={logo.id}
          fallback={
            <FallbackModel
              position={logo.position}
              color={logo.color}
              name={logo.name}
              onSelect={() => onSelect(logo)}
            />
          }
        >
          <GLBModel
            path={logo.path}
            position={logo.position}
            color={logo.color}
            name={logo.name}
            onSelect={() => onSelect(logo)}
          />
        </Suspense>
      ))}

      <Preload all />
    </>
  );
}

// -------------------------------------------------------------

function DetailModal3D({ path, color }) {
  const groupRef = useRef();

  const gltf = useGLTF(path);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  if (!gltf || !gltf.scene) {
    return <DetailModalFallback color={color} />;
  }

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene.clone()} scale={2.5} />
      <pointLight
        position={[0, 3, 0]}
        intensity={3}
        color={color}
        distance={8}
      />
    </group>
  );
}

function DetailModalFallback({ color }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <Box ref={meshRef} args={[2.5, 2.5, 2.5]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </Box>
  );
}

// -------------------------------------------------------------

export default function App() {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .backdrop-blur {
          backdrop-filter: blur(10px);
        }
        .translate-x-n100 {
          transform: translateX(-100%);
        }
        @media (min-width: 768px) {
          .translate-x-n100 {
            transform: translateX(0) !important;
          }
        }
      `}</style>

      <div
        className="min-vh-100 bg-dark overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
        }}
      >
        {/* Header */}
        <header
          className="position-sticky top-0 start-0 end-0 border-bottom"
          style={{
            zIndex: 1030,
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.1) !important",
          }}
        >
          <div className="container-fluid px-4 py-3">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-link text-white d-md-none p-0 border-0"
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    style={{ textDecoration: "none" }}
                  >
                    {isPanelOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
                  <Cpu
                    className="text-primary"
                    size={32}
                    style={{ color: "#818cf8" }}
                  />
                  <h1 className="h4 mb-0 fw-bold text-white">Tecnologías 3D</h1>
                </div>
              </div>
              <div className="col-auto">
                <small className="text-muted">
                  {TECH_LOGOS.length} tecnologías • Click para detalles
                </small>
              </div>
            </div>
          </div>
        </header>

        {/* Loading overlay */}
        {isLoading && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center backdrop-blur"
            style={{
              zIndex: 1050,
              background: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="text-center">
              <Loader2
                className="mb-3 mx-auto animate-spin"
                size={48}
                style={{ color: "#818cf8" }}
              />
              <p className="text-white fs-5">Cargando modelos 3D...</p>
              <p className="text-muted small mt-2">
                Esto puede tardar unos segundos
              </p>
            </div>
          </div>
        )}

        <div className="container-fluid px-0">
          <div className="row g-0" style={{ height: "calc(100vh - 70px)" }}>
            {/* Panel lateral */}
            <aside
              className={`col-md-3 col-lg-3 bg-dark p-4 overflow-auto ${
                isPanelOpen ? "" : "translate-x-n100"
              }`}
              style={{
                zIndex: 1020,
                transition: "transform 0.3s ease-in-out",
                position: "fixed",
                height: "100%",
                left: 0,
                top: "70px",
                background: "rgba(17, 24, 39, 0.95)",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                ...(window.innerWidth >= 768 && {
                  position: "relative",
                  top: 0,
                }),
              }}
            >
              <h2
                className="h4 fw-bold mb-4 d-flex align-items-center"
                style={{ color: "#818cf8" }}
              >
                <Cpu className="me-2" size={28} /> Elige una Opción
              </h2>

              {selectedLogo && (
                <div
                  className="p-3 rounded mb-4 border-start border-4"
                  style={{
                    background: "rgba(55, 65, 81, 0.5)",
                    borderColor: "#6366f1 !important",
                  }}
                >
                  <p className="fs-5 fw-semibold mb-1 text-white">
                    {selectedLogo.name}
                  </p>
                  <p className="small text-muted mb-2">
                    Click para ver detalles
                  </p>
                  <button
                    onClick={() => setSelectedLogo(null)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Limpiar Selección
                  </button>
                </div>
              )}

              <nav className="overflow-auto" style={{ maxHeight: "70vh" }}>
                <p className="small text-muted text-uppercase mb-3">
                  Explora ({TECH_LOGOS.length})
                </p>

                <div className="d-flex flex-column gap-2">
                  {TECH_LOGOS.map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() => {
                        setSelectedLogo(logo);
                        if (window.innerWidth < 768) setIsPanelOpen(false);
                      }}
                      className="btn text-start p-3 rounded d-flex align-items-center border-0"
                      style={{
                        backgroundColor:
                          selectedLogo?.id === logo.id
                            ? "#6366f1"
                            : "rgba(55, 65, 81, 0.8)",
                        color: "white",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLogo?.id !== logo.id) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(75, 85, 99, 0.9)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLogo?.id !== logo.id) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(55, 65, 81, 0.8)";
                        }
                      }}
                    >
                      <Zap
                        size={18}
                        className="me-3"
                        style={{ color: logo.color }}
                      />
                      <span>{logo.name}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </aside>

            {/* Canvas 3D */}
            <div
              className="col-md-9 col-lg-9 position-relative d-flex align-items-center justify-content-center"
              style={{
                marginLeft: window.innerWidth >= 768 ? "auto" : "0",
              }}
            >
              <Canvas
                shadows
                camera={{ position: [0, 0, 12], fov: 50 }}
                className="w-100 h-100"
                onCreated={() => setTimeout(() => setIsLoading(false), 2000)}
              >
                <LogoScene onSelect={setSelectedLogo} />
              </Canvas>
            </div>
          </div>
        </div>

        {/* Modal con detalles */}
        {selectedLogo && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center backdrop-blur"
            style={{
              zIndex: 1060,
              background: "rgba(0, 0, 0, 0.75)",
            }}
            onClick={() => setSelectedLogo(null)}
          >
            <div
              className="rounded-3 shadow-lg mx-4"
              style={{
                maxWidth: "1000px",
                width: "90%",
                background:
                  "linear-gradient(135deg, rgba(31, 41, 55, 0.98), rgba(17, 24, 39, 0.98))",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div
                className="p-4 border-bottom rounded-top"
                style={{
                  backgroundColor: selectedLogo.color + "20",
                  borderColor: "rgba(255, 255, 255, 0.1) !important",
                }}
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center shadow-lg"
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: selectedLogo.color,
                      }}
                    >
                      <Zap className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="h3 fw-bold text-white mb-1">
                        {selectedLogo.name}
                      </h2>
                      <p className="text-light mb-0">
                        {selectedLogo.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLogo(null)}
                    className="btn btn-link text-muted p-2 border-0"
                    style={{
                      fontSize: "2rem",
                      textDecoration: "none",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Body del modal con vista 3D interactiva */}
              <div className="p-4">
                <div
                  className="rounded-3 overflow-hidden border mb-3"
                  style={{
                    height: "600px",
                    background: "rgba(0, 0, 0, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.1) !important",
                  }}
                >
                  <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <directionalLight position={[-5, -5, -5]} intensity={0.5} />

                    <Suspense
                      fallback={
                        <DetailModalFallback color={selectedLogo.color} />
                      }
                    >
                      <DetailModal3D
                        path={selectedLogo.path}
                        color={selectedLogo.color}
                      />
                    </Suspense>

                    <OrbitControls
                      enableZoom={true}
                      enablePan={false}
                      minDistance={2}
                      maxDistance={12}
                      autoRotate
                      autoRotateSpeed={1}
                    />
                  </Canvas>
                </div>

                <p className="text-muted small text-center mb-3 d-flex align-items-center justify-content-center gap-2">
                  <RotateCw size={16} />
                  Arrastra para rotar • Scroll para zoom
                </p>

                <div className="d-flex gap-3">
                  <button
                    onClick={() => setSelectedLogo(null)}
                    className="btn flex-fill py-2"
                    style={{ backgroundColor: "#6366f1", color: "white" }}
                  >
                    Cerrar
                  </button>
                  <button
                    className="btn text-white py-2 px-4"
                    style={{ backgroundColor: selectedLogo.color }}
                  >
                    Más info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
