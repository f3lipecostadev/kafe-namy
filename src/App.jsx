import { useEffect, useRef, useState, useMemo } from "react"

export default function App() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)

  const startDate = useMemo(() => new Date("2025-07-02"), [])

  const photoColors = useMemo(
    () => [
      "#800033",
      "#662200",
      "#994C1A",
      "#A33A20",
      "#A34700",
      "#A34026",
    ],
    []
  )

  const [time, setTime] = useState({
    anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0, atualizado: 0
  })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = now - startDate
      const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
      const meses = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const dias = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const segundos = Math.floor((diff % (1000 * 60)) / 1000)
      setTime({ anos, meses, dias, horas, minutos, segundos, atualizado: Date.now() })
    }

    updateTimer()
    const id = setInterval(updateTimer, 1000)
    return () => clearInterval(id)
  }, [startDate])

  useEffect(() => {
    const sobreCasal = document.querySelector(".sobre-casal")
    const mensagem = document.querySelector(".mensagem")
    const color = photoColors[currentPhotoIndex]
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    document.documentElement.style.setProperty("--current-color", color)
    if (sobreCasal) sobreCasal.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.9)`
    if (mensagem) mensagem.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.8)`
  }, [currentPhotoIndex, photoColors])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleProgressClick = (e) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100
      setProgress(percent || 0)
    }
    audio.addEventListener("timeupdate", updateProgress)
    return () => audio.removeEventListener("timeupdate", updateProgress)
  }, [])

  return (
    <div className="main-container">
      <div className="player-container">
        <div className="player">
          <h2>KaFe☕ & NaMy💚</h2>

          <div className="album">
            <div className="carousel">
              <div className="carousel-inner">
                {["polaroid", "img1", "img2", "img3", "img4", "img5"].map((img, i) => (
                  <div
                    key={i}
                    className={`carousel-item ${i === currentPhotoIndex ? "active" : ""}`}
                  >
                    <img src={`/images/${img}.jpeg`} alt={`Foto ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="music-info">
            <h3>Eternamente</h3>
            <p>Gal Costa</p>
          </div>

          <div className="player__progress">
            <div className="player__time">
              {audioRef.current
                ? `${Math.floor(audioRef.current.currentTime / 60)
                    .toString()
                    .padStart(1, "0")}:${Math.floor(audioRef.current.currentTime % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "0:00"}
            </div>
            <div className="player__bar" onClick={handleProgressClick}>
              <div
                className="player__bar-progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="player__time">
              {audioRef.current
                ? `${Math.floor(audioRef.current.duration / 60)
                    .toString()
                    .padStart(1, "0")}:${Math.floor(audioRef.current.duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "0:00"}
            </div>
          </div>

          <div className="player__controllers">
            <i className="player__icon fas fa-random"></i>
            <i
              className="player__icon fas fa-step-backward"
              onClick={() => setCurrentPhotoIndex((p) => (p - 1 + 6) % 6)}
            ></i>
            <i
              className={`player__icon player__icon--play fas ${
                isPlaying ? "fa-pause-circle" : "fa-play-circle"
              }`}
              onClick={handlePlayPause}
            ></i>
            <i
              className="player__icon fas fa-step-forward"
              onClick={() => setCurrentPhotoIndex((p) => (p + 1) % 6)}
            ></i>
            <i className="player__icon fas fa-redo"></i>
          </div>

          <audio ref={audioRef} src="/audio/music.mp3" loop preload="auto" />
        </div>
      </div>

      <div className="sobre-casal">
        <p className="sobre-titulo">Sobre o casal</p>
        <img src="/images/casal.jpeg" alt="Foto do casal" className="foto-casal" />
        <h2 className="nomes">Felipe Kauã e Nathália Mylene</h2>
        <p className="sub">O destino nos uniu desde 2025</p>

        <div className="contador">
          {Object.entries(time).map(([k, v]) =>
            k !== "atualizado" ? (
              <div className="tempo" key={k}>
                <span>{v.toString().padStart(2, "0")}</span>
                <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
              </div>
            ) : null
          )}
        </div>

        <div className="mensagem">
          <h3>Mensagem especial</h3>
          <p>
            Não tem um dia na minha vida em que eu não me pergunte o que seria de mim se eu não tivesse te conhecido. Você pegou na minha mão e caminhou ao meu lado, enfrentando comigo cada briga, desentendimento, ciúme e dificuldade que aparecia. Você me ensinou a confiar de novo. Me ensinou o que é amar de verdade,
             da forma mais prática possível. Antes, eu tinha inseguranças; agora, eu tenho certezas. A maior delas é você! Ninguém e nada neste mundo é capaz de me fazer duvidar disso: eu te amo, Mylene, e quero que seja minha pra sempre!
          </p>
        </div>
      </div>

      <section className="wrapped-card">
        <img src="/images/background.png" alt="Capa da playlist" className="wrapped-img" />
        <button
          className="wrapped-btn"
          onClick={() =>
            window.open("https://open.spotify.com/playlist/69iag0GDXCRI7RmQkJmdxS?si=6-lG7qOFQv-9o1jlYbqE_w")
          }
        >
          Ouvir Playlist
        </button>
      </section>
    </div>
  )
}
