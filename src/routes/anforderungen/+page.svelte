<h1>Anforderungen "Wer würde eher?"</h1>

<div class="legende">
	<p>Die Anforderungen sind folgendermaßen kategorisiert:</p>
	<ul>
		<li class="muss">Muss</li>
		<li class="soll">Soll</li>
		<li class="wird">Wird</li>
	</ul>
</div>
<details open>
	<summary class="main-summary">Online-Multiplayer</summary>

	<details>
		<summary class="muss">Raum erstellen</summary>
		<p>
			Das Spiel muss Spielern die Möglichkeit bieten einen eigenen Raum zu erstellen.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="muss">Raum beitreten</summary>
		<p>
			Das Spiel muss anderen nicht-hostenden Spielern die Möglichkeit bieten, einem bestehenden Raum
			beizutreten.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="soll">Chatfunktion</summary>
		<p>
			Das Spiel soll Spielern die Möglichkeit geben in Echtzeit per Text zu kommunizieren.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="soll">Spieler kicken</summary>
		<p>
			Das Spiel soll dem Host die Möglichkeit geben, andere Spieler aus dem Raum zu entfernen.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="wird">Account erstellen</summary>
		<p>
			Das Spiel wird Spielern die Möglichkeit geben, Accounts zu erstellen, die in der Datenbank
			persistiert werden.<br />
			nicht Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="wird">Sprachchatfunktion</summary>
		<p>
			Das Spiel wird Spielern die Möglichkeit geben, mit anderen Spielern in Echtzeit per
			Sprachkanal zu kommunizieren.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>
</details>

<details>
	<summary class="main-summary">Local Multiplayer</summary>

	<details>
		<summary class="muss">Hot Seat</summary>
		<p>
			Das Spiel muss Spielern die Möglichkeit geben, einen lokalen Hot Seat zu erstellen.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="wird">Lokal Wifi</summary>
		<p>
			Das Spiel wird Spielern die Möglichkeit geben, ein Spiel über das LAN zu erstellen.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>
</details>

<details>
	<summary class="main-summary">Fragen</summary>

	<details>
		<summary class="muss">Vorgefertigte Fragen</summary>
		<p>
			Das Spiel muss fähig sein, vorgefertigte und für alle sichtbar Fragen bereit zu stellen.<br />
			Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="muss">Zufällige Auswahl von Fragen</summary>
		<p>
			Das Spiel muss fähig sein, zufällig Fragen aus den Fragesätzen/Fragen auszuwählen.<br />
			nicht Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="soll">Auswählen aus mehreren Fragesätzen</summary>
		<p>
			Das Spiel soll den Spielern die Möglichkeit geben, aus mehreren Fragesätzen zu wählen.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="soll">Eingabefeld für eigene Fragen</summary>
		<p>
			Das Spiel soll Spielern die Möglichkeit geben, eigene Fragen in ein Textfeld über das UI
			einzugeben.<br />
			nicht Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="soll">keine Wiederholungen</summary>
		<p>
			Das Spiel soll fähig sein eine bereits verwendete Frage innerhalb desselben Spiels nicht
			erneut auszuwählen.<br />
			Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="wird"> User erstellen eigene, öffentliche Fragensätze </summary>
		<p>
			Das Spiel wird Spielern die Möglichkeit geben, eigene Fragesätze zu erstellen, welche
			öffentlich sein werden und mit dem Account des Nutzers verknüpft sind.<br />
			Funktional, Systemanforderung
		</p>
	</details>
</details>

<details>
	<summary class="main-summary">Game Loop</summary>

	<details>
		<summary class="muss">Spielstruktur</summary>
		<p>
			Das Spiel muss nach Start des Spiels eine Frage auswählen und diese allen aktiven Spielern
			anzeigen.<br />
			Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="muss">Rundenablauf</summary>
		<p>
			Das Spiel muss nach Ablauf der Antwortzeit die Antworten aller Spieler auswerten und das
			Ergebnis anzeigen.<br />
			Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="muss">Terminierung</summary>
		<p>
			Das Spiel muss erkennen, wann das Spiel beendet ist. Am Ende muss ein Gewinner bzw. eine
			Rangliste angezeigt werden.<br />
			Funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="muss">Stetigkeit</summary>
		<p>
			Sobald die Ergebnisse einer Runde angezeigt werden, muss dem Host eine Möglichkeit geboten die
			nächste Runde zu starten.<br />
			Funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="wird">Übersetzung</summary>
		<p>
			Das Spiel wird Fragen automatisch in die Sprache des jeweiligen Nutzers übersetzen.<br />
			Funktional, Systemanforderung
		</p>
	</details>
</details>
<details>
	<summary class="main-summary">Nichtfunktionale Anforderungen</summary>

	<details>
		<summary class="muss">Echtzeit</summary>
		<p>
			Das Spiel muss die Daten (~Auswählen einer Frage, Abstimmung etc.) in Echtzeit übermitteln.
			(Ziel: Server-Latenz von max. 100ms im selben Land)<br />
			nicht-funktional, Systemanforderung (Infrastruktur)
		</p>
	</details>

	<details>
		<summary class="muss">Bedienbarkeit</summary>
		<p>
			Das Spiel muss so übersichtlich und intuitiv bedienbar sein, dass neue Spieler ohne
			zusätzliche Erklärung eine Runde starten und an einer Abstimmung teilnehmen können.<br />
			Nicht-funktional, Benutzeranforderung
		</p>
	</details>

	<details>
		<summary class="muss">Verfügbarkeit</summary>
		<p>
			Der Online-Spielbetrieb muss an mindestens 99 % der Zeit pro Monat verfügbar sein, ausgenommen
			angekündigte Wartungsarbeiten.<br />
			Nicht-funktional, Systemanforderung
		</p>
	</details>

	<details>
		<summary class="soll">Gerätekompatibilität</summary>
		<p>
			Das Spiel soll auf Smartphones, Tablets und Desktop-Computern übersichtlich dargestellt und
			vollständig bedienbar sein.<br />
			Nicht-funktional, Systemanforderung
		</p>
	</details>
</details>

<style>
	:global(body) {
		font-family: 'Roboto', sans-serif;
		color: white;
		background-color: black;
	}

	h1 {
		font-size: 3rem;
		text-align: center;
		margin-top: 2rem;
		color: rgb(255, 255, 255);
	}
	details {
		padding: 1.5rem;
		margin: 0.5rem;
		border-radius: 1rem;
		background-color: hsla(220, 26%, 7%, 0.5);
		outline: 3px solid hsla(0, 0%, 100%, 0.2);
	}
	summary {
		font-size: 1.5rem;
		font-weight: bold;
		cursor: pointer;
	}

	.main-summary {
		font-size: 2rem;
		font-weight: bold;
		cursor: pointer;
		text-align: left;
		margin-bottom: 1rem;
	}

	.muss {
		color: red;
		font-weight: bold;
	}
	.soll {
		color: yellow;
	}
	.wird {
		color: green;
	}
	.legende {
		font-size: 1.5rem;
		margin: 1rem 0.5rem;
		padding: 1rem;
		background-color: hsla(220, 26%, 7%, 0.75);
		border-radius: 1rem;
		outline: 3px solid hsla(0, 0%, 100%, 0.2);
	}
</style>
