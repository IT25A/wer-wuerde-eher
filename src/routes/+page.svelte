<script lang="ts">
	/**
	 * Landing Page für "Wer würde eher?"
	 *
	 * Diese Datei ist die Startseite der App. Sie zeigt das Logo,
	 * den Spielmoderator und die drei Haupt-Spielmodi.
	 *
	 * Anpassungen:
	 * - ROUTES: Pfade zu den einzelnen Spielmodi-Seiten.
	 *   Diese müssen als +page.svelte in src/routes/<pfad>/ existieren.
	 * - MASKOT: Dateiname des Moderator-Bilds für die Startseite.
	 *   Optionen im static/politician-Ordner: normal, happy, challenging,
	 *   thinking, celebrating, no_clue.
	 */

	// SvelteKit-Hilfsfunktion, die interne URLs korrekt mit der Base-Path-Einstellung
	// auflöst. Statt direkt href="/..." wird href={resolve('/...')} empfohlen.
	import { resolve } from '$app/paths';

	// Pfade zu den Unterseiten. Bei Bedarf können diese hier geändert werden.
	const ROUTES = {
		hotSeat: '/hot-seat',
		questions: '/questions',
		customQuestions: '/custom-questions'
	} as const;

	// Welche Mimik der Moderator auf der Landing Page zeigt.
	// Für die Startseite eignet sich besonders "challenging" (zeigt auf den Spieler)
	// oder "normal" (freundliches Willkommen).
	const MASKOT = 'challenging';

	/**
	 * Text in der Sprechblase des Moderators.
	 * Hier könnt ihr einen Claim, ein Zitat oder einen Aufforderungstext eintragen.
	 */
	const SPEECH = 'Wer traut sich?';
</script>

<svelte:head>
	<title>Wer würde eher? – Das Partyspiel für Freunde</title>
	<meta
		name="description"
		content="Spiele Wer würde eher? im Hot Seat oder entdecke spannende Fragen für deine nächste Party."
	/>
</svelte:head>

<!--
	Hauptcontainer: Füllt den gesamten Viewport mit einem Casino-/Roulette-Hintergrund.
	Der Hintergrund setzt sich aus Filz-Textur, Scheinwerfer-Effekten und
	dekorative Casino-Elementen zusammen.
-->
<main class="landing">
	<!--
		Team-Badge: Dezente, aber stilvolle Kennzeichnung oben links.
		Füllt Leerraum und gibt der Seite einen professionellen Rahmen.
	-->
	<div class="team-badge" aria-label="Entwickelt von Gruppe G an der HWR Berlin">
		<span class="team-badge-dot"></span>
		Gruppe G · HWR Berlin
	</div>

	<div class="content">
		<!--
			Kopfbereich mit Logo und Untertitel.
			das h1 ist nur für Screenreader und SEO sichtbar (Tailwind sr-only).
			Das eigentliche Logo wird als Bild dargestellt.
		-->
		<header class="hero">
			<h1 class="sr-only">Wer würde eher? – Das Partyspiel für Freunde</h1>
			<img
				src="/politician/logo.png"
				alt="Wer würde eher? Logo im Casino-Stil"
				width="1536"
				height="1024"
				class="logo"
			/>
			<p class="tagline">Wähle deinen Spielmodus</p>
		</header>

		<!--
			Spielbereich: Desktop zeigt das Spielfeld-Panel links und den Moderator rechts.
			Auf kleinen Bildschirmen werden beide untereinander dargestellt.
		-->
		<div class="game-board">
			<!--
				Spielfeld-Panel: Grüne Tisch-Optik mit goldenem Rand.
				Hier sind die Buttons für die drei Spielmodi und den Eigene-Fragen-Link.
			-->
			<section class="panel" aria-label="Spielmodi">
				<!--
					Online-Modus: Noch nicht implementiert, deshalb deaktiviert.
					Sobald der Multiplayer fertig ist, disabled entfernen und href ergänzen.
				-->
				<button
					type="button"
					disabled
					aria-disabled="true"
					class="mode-btn mode-btn-disabled"
					title="Online-Multiplayer – bald verfügbar"
				>
					<span class="mode-label">Online</span>
					<span class="badge">BALD</span>
				</button>

				<!--
					Haupt-Call-to-Action: Startet den lokalen Hot-Seat-Modus.
					Verlinkt auf /hot-seat.
				-->
				<a href={resolve(ROUTES.hotSeat)} class="mode-btn mode-btn-primary">
					<span class="mode-label">Hot Seat</span>
				</a>

				<!--
					Sekundär-Modus: Zeigt nur Fragen an, ohne Punktesystem.
					Verlinkt auf /questions.
				-->
				<a href={resolve(ROUTES.questions)} class="mode-btn mode-btn-felt">
					<span class="mode-label">Nur Fragen</span>
				</a>

				<!--
					Verweis auf die eigene-Fragen-Seite.
					Weniger prominent als die Hauptbuttons.
				-->
				<a href={resolve(ROUTES.customQuestions)} class="own-questions">
					Eigene Fragen einreichen
				</a>
			</section>

			<!--
				Moderator-Spalte: Speech-Bubble + Portrait.
				Auf Desktop nimmt diese Spalte die rechte Seite ein.
			-->
			<div class="host-column">
				<!--
					Sprechblase: Füllt die Szene und gibt dem Moderator Persönlichkeit.
					Text ist über die SPEECH-Variable steuerbar.
				-->
				<div class="speech-bubble" aria-hidden="true">
					<p>{SPEECH}</p>
				</div>

				<!--
					Moderator-Karte: Eingerahmtes Portrait, das wie ein Gastgeber
					am Roulette-Tisch wirkt. Das Bild wird aus static/politician geladen.
				-->
				<aside class="host-card" aria-label="Spielmoderator">
					<img
						src="/politician/{MASKOT}.png"
						alt="Spielmoderator im Anzug heißt euch willkommen"
						width="1024"
						height="1536"
						class="host-image"
					/>
				</aside>
			</div>
		</div>
	</div>

	<!--
		Seitenfuß: Dezent, aber sichtbar. Füllt bei kurzem Inhalt den unteren Bereich.
	-->
	<footer class="footer">Gruppe G · HWR Berlin · Software Engineering</footer>
</main>

<style>
	/*
		========================================
		CSS-Variablen: Casino-/Roulette-Farben
		========================================
		Diese Palette orientiert sich an eurem Logo
		und einem klassischen Roulette-Tisch:
		Bordeaux (Rot), Filz-Grün, Gold, Schwarz.
	*/
	.landing {
		--roulette-bg: #070707;
		--roulette-felt: #0f3d2e;
		--roulette-felt-dark: #081f17;
		--roulette-bordeaux: #5c0a1e;
		--roulette-bordeaux-light: #7a0f2b;
		--roulette-gold: #c9a227;
		--roulette-gold-light: #e6c86b;
		--roulette-cream: #f5e6c8;
		--roulette-disabled: #2a2a2a;

		/*
			Hintergrund: tiefes Schwarz mit mehreren Ebenen:
			1. Grüner Scheinwerfer von oben (wie Casino-Filz)
			2. Roter Akzentschein von rechts-unten
			3. Dezente Punkt-Textur für Filz-Optik
		*/
		position: relative;
		min-height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--roulette-bg);
		background-image:
			radial-gradient(ellipse at 50% 10%, rgba(15, 61, 46, 0.6) 0%, transparent 55%),
			radial-gradient(circle at 85% 80%, rgba(92, 10, 30, 0.25) 0%, transparent 35%),
			radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size:
			100% 100%,
			100% 100%,
			24px 24px;
		color: var(--roulette-cream);
		padding: 1rem;
		overflow: hidden;
	}

	/*
		Team-Badge: Oben links, dezent, mit Farbcodierung.
		Nutzt position: absolute, damit es oben bleibt.
	*/
	.team-badge {
		position: absolute;
		top: 1.25rem;
		left: 1.25rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--roulette-gold-light);
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid var(--roulette-gold);
		border-radius: 999px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 10;
	}

	.team-badge-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--roulette-gold);
		box-shadow: 0 0 8px var(--roulette-gold);
	}

	.content {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	@media (min-width: 1200px) {
		.content {
			/* Auf großen Bildschirmen mehr Platz nutzen */
			max-width: 1320px;
			gap: 2.5rem;
		}
	}

	.hero {
		text-align: center;
		width: 100%;
	}

	/*
		Logo: Auf Desktop größer, auf mobilen Geräten 90% der Breite.
		Goldener Schein, damit es mit dem Hintergrund harmoniert.
	*/
	.logo {
		/* Tailwind-Preflight setzt img auf display: block, daher zentriert text-align nicht. */
		display: block;
		margin-inline: auto;
		width: min(90%, 520px);
		height: auto;
		filter: drop-shadow(0 0 24px rgba(201, 162, 39, 0.35));
	}

	@media (min-width: 992px) {
		.logo {
			width: min(85%, 680px);
		}
	}

	.tagline {
		margin-top: 0.5rem;
		font-size: clamp(1.1rem, 2.5vw, 1.6rem);
		color: var(--roulette-gold-light);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	/*
		game-board: Mobile = 1 Spalte, Desktop = Panel + Moderator nebeneinander.
		Verhältnis ca. 55:45, damit beide Spalten gut zur Geltung kommen.
	*/
	.game-board {
		display: grid;
		grid-template-columns: 1fr;
		align-items: start;
		gap: 2rem;
		width: 100%;
	}

	@media (min-width: 768px) {
		.game-board {
			grid-template-columns: 1.15fr 0.85fr;
			gap: 3rem;
			align-items: stretch;
		}
	}

	@media (min-width: 1200px) {
		.game-board {
			grid-template-columns: 1fr 0.8fr;
			gap: 4rem;
		}
	}

	/*
		Spielfeld-Panel: Grüne Tisch-Optik, goldener Rahmen, abgerundete Ecken.
		Alle Buttons sind vertikal angeordnet.
	*/
	.panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: linear-gradient(180deg, var(--roulette-felt) 0%, var(--roulette-felt-dark) 100%);
		border: 2px solid var(--roulette-gold);
		border-radius: 1.5rem;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		box-shadow:
			0 0 50px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	@media (min-width: 1200px) {
		.panel {
			padding: 2.5rem 3rem;
			gap: 1.25rem;
		}
	}

	/*
		Gemeinsame Basis für alle Modus-Buttons.
		Wird sowohl für <button> (Online, disabled) als auch <a> (Hot Seat, Nur Fragen) genutzt.
	*/
	.mode-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem 1.5rem;
		border-radius: 0.75rem;
		font-weight: 700;
		font-size: clamp(1rem, 2.5vw, 1.25rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			background-color 0.15s ease;
		border: 2px solid var(--roulette-gold);
		box-shadow:
			0 4px 14px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	/* Haupt-Call-to-Action: Bordeaux/Gold-Gradient wie im Logo. */
	.mode-btn-primary {
		background: linear-gradient(180deg, var(--roulette-bordeaux-light), var(--roulette-bordeaux));
		color: var(--roulette-cream);
	}

	.mode-btn-primary:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow:
			0 8px 24px rgba(201, 162, 39, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	/* Sekundär-Button: Dunkles Filz-Grün mit goldenem Rand. */
	.mode-btn-felt {
		background: linear-gradient(180deg, #17664c, var(--roulette-felt));
		color: var(--roulette-cream);
	}

	.mode-btn-felt:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow:
			0 8px 24px rgba(201, 162, 39, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	/* Deaktivierter Online-Button: grau, kein Hover-Effekt. */
	.mode-btn-disabled {
		background: var(--roulette-disabled);
		color: #888;
		border-color: #555;
		cursor: not-allowed;
		opacity: 0.7;
	}

	.mode-btn-disabled:hover {
		transform: none;
		box-shadow: none;
	}

	/* Kleines Badge für "BALD" auf dem Online-Button. */
	.badge {
		padding: 0.125rem 0.5rem;
		font-size: 0.625rem;
		border-radius: 999px;
		background: var(--roulette-gold);
		color: #000;
	}

	/* Eigene-Fragen-Link: dezent, goldfarben, unterstrichen. */
	.own-questions {
		margin-top: 0.5rem;
		text-align: center;
		color: var(--roulette-gold-light);
		text-decoration: underline;
		text-underline-offset: 4px;
		font-weight: 600;
		transition: color 0.15s ease;
	}

	.own-questions:hover {
		color: var(--roulette-cream);
	}

	/*
		Moderator-Spalte: Flex-Container, der Sprechblase und Karte übereinander stapelt.
	*/
	.host-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.host-column {
			justify-content: flex-end;
			gap: 2rem;
		}
	}

	/*
		Sprechblase über dem Moderator.
		Optisch an das Farbschema angepasst, mit einem Dreieck als Sprechblase-Pfeil.
	*/
	.speech-bubble {
		position: relative;
		padding: 1rem 1.75rem;
		font-size: clamp(1.1rem, 2vw, 1.5rem);
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--roulette-cream);
		text-align: center;
		background: linear-gradient(180deg, var(--roulette-bordeaux-light), var(--roulette-bordeaux));
		border: 2px solid var(--roulette-gold);
		border-radius: 1rem;
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.4),
			0 0 20px rgba(201, 162, 39, 0.2);
		max-width: 90%;
	}

	.speech-bubble::after {
		content: '';
		position: absolute;
		bottom: -0.75rem;
		left: 50%;
		transform: translateX(-50%);
		border-width: 0.75rem 0.75rem 0;
		border-style: solid;
		border-color: var(--roulette-gold) transparent transparent transparent;
	}

	@media (min-width: 768px) {
		.speech-bubble {
			max-width: 85%;
		}
	}

	/*
		Moderator-Karte: Portrait mit goldenem Rahmen und leichtem Tilt.
		Der ::before-Pseudo-Element erzeugt einen goldenen Scheinwerfer hinter dem Bild.
	*/
	.host-card {
		position: relative;
		background: linear-gradient(180deg, #1a1a1a, #0a0a0a);
		border: 2px solid var(--roulette-gold);
		border-radius: 1rem;
		box-shadow: 0 0 50px rgba(201, 162, 39, 0.15);
		overflow: hidden;
		transform: rotate(-1deg);
		transition: transform 0.3s ease;
		width: 100%;
		max-width: 380px;
	}

	.host-card:hover {
		transform: rotate(0deg) scale(1.01);
	}

	.host-card::before {
		content: '';
		position: absolute;
		inset: -20%;
		background: radial-gradient(circle, rgba(201, 162, 39, 0.18) 0%, transparent 60%);
		filter: blur(40px);
		z-index: 0;
	}

	@media (min-width: 992px) {
		.host-card {
			max-width: 420px;
		}
	}

	@media (min-width: 1200px) {
		.host-card {
			max-width: 460px;
		}
	}

	.host-image {
		position: relative;
		z-index: 1;
		width: 100%;
		height: auto;
		display: block;
	}

	.footer {
		margin-top: auto;
		padding-top: 2rem;
		font-size: 0.85rem;
		color: #888;
		text-align: center;
	}
</style>
