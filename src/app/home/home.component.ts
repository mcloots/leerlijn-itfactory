import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  showGrid = false; // Controleert of de grid zichtbaar is
  isMuted = false; // Controls the audio mute state
  titleText = 'Press Start to Continue… Your IT adventure awaits!'
  selectedProfile: any = null; // The currently selected profile

  @ViewChild('backgroundAudio') backgroundAudio!: ElementRef<HTMLAudioElement>;
  @ViewChild('selectAudio') selectAudio!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit(): void {
    this.backgroundAudio.nativeElement.play();
  }

  onStart() {
    this.selectAudio.nativeElement.play(); // Play the select sound once
    this.showGrid = true; // Toont de grid en activeert de transitie
    this.titleText = 'Choose your destiny!'
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.backgroundAudio.nativeElement.muted = this.isMuted;
    this.backgroundAudio.nativeElement.play();
  }

  resetToInitialState() {
    this.selectAudio.nativeElement.play(); // Play the select sound once
    this.showGrid = false; // Hide the grid
    this.titleText = 'Press Start to Continue… Your IT adventure awaits!';
    this.selectedProfile = null; // Reset the selected profile
  }

  resetToGridState() {
    this.selectAudio.nativeElement.play(); // Play the select sound once
    this.showGrid = true;
    this.selectedProfile = null;
  }

  selectProfile(profile: any) {
    this.selectAudio.nativeElement.play(); // Play the select sound once
    this.selectedProfile = profile; // Set the selected profile
  }

  profiles = [
    {
      name: 'Cloud & Cyber Security', img: 'ccs.png', route: 'ccs',
      title: 'Cybersecurity Operations, word een echte IT commando!',
      description: `<p>Ben jij klaar om de digitale wereld te verdedigen en jezelf te transformeren tot een echte IT commando? In ons unieke traject “Cybersecurity Operations” ontdek je hoe je onze maatschappij kan verdedigen tegen de miljoenen aanvallen die dagelijks gebeuren.</p><br>
      <p>Je duikt in de wereld van cybersecurity operations en leert technieken en tactieken om aanvallen te detecteren en tegen te houden. Je bouwt hiervoor een Security Operations Center (SOC) in ons datacenter. Met een combinatie van offensieve (Red Team) en defensieve (Blue Team) securitytechnieken ga je mee ten strijde tegen cybercrime.</p><br>
      <p>Wil jij onze samenleving beschermen door een sterke digitale beveiliging op te zetten? Stap dan in de rol van een IT commando!</p> `
    },
    {
      name: 'Ethical Hacking', img: 'ethicalhacking.png', route: 'ccs',
      title: 'Ethical Hacking, word een echte IT ninja!',
      description: `<p>Ben jij klaar om de digitale wereld te beschermen en een echte IT ninja te worden?  
In ons unieke traject Ethical Hacking duik je diep in de fascinerende wereld van “Offensive security”. Je leert zwakheden in IT systemen opsporen en geeft aanbevelingen hoe deze op te lossen.</p>
<br>
<p>Met een flinke dosis creativiteit en technische vaardigheden ontwikkel je de expertise om op een legitieme manier als pentester te opereren.  Je analyseert de risico's die je tegenkomt en maakt heldere rapportages waarmee organisaties direct aan de slag kunnen. Je zal dit in je opleiding ook toepassen bij echte bedrijven en organisaties.</p>
<br>
<p>Om je vaardigheden naar een nog hoger niveau te tillen, neem je deel aan spannende competities zoals Capture the Flag (CTF) en King of The Hill (KoTH), waar je praktische kennis opdoet in uitdagende en realistische scenario’s.</p>
<br>
<p> Is je motto “Break it to learn”? Speel je graag met technologie en ben je competitief ingesteld? Dan ben jij de perfecte kandidaat voor dit traject en word je de sleutel tot een veiligere digitale toekomst als IT ninja!</p>`
    },
    {
      name: 'Cloud Automation & Defence', img: 'cloudautomationdefence.png', route: 'ccs',
      title: 'Cloud Automation and Defence, word een echte IT wizard!',
      description: `<p>Ben jij klaar om de digitale wereld te transformeren en een echte IT wizard te worden?  
In ons unieke traject "Cloud Automation and Defence" duik je in de fascinerende wereld van de cloud.</p>
      <br>
      <p>Je leert op een veilige, efficiënte en geautomatiseerde manier met cloudtechnologieën (zoals Amazon Web Services,  Microsoft Azure, Google Cloud Platform, ...) robuuste en schaalbare IT-oplossingen op te zetten die perfect aansluiten op de behoeften van bedrijven en hun applicaties. We werken hierbij volgens de “Infrastructure-As-Code" en “DevSecOps” principes.</p>
      <br>
      <p>Als jij de architect wilt worden van een veilige digitale cloud, dan is dit traject perfect voor jou. Transformeer jezelf tot een echte IT wizard!</p>`
    },
    {
      name: 'Full Stack Software Development', img: 'fullstack.png', route: 'app',
      title: '',
      description: ``
    },
    {
      name: 'Machine Learning', img: 'ml.png', route: 'ai',
      title: '',
      description: ``
    },
    {
      name: 'Enterprise Solutions', img: 'enterpr.png', route: 'app',
      title: '',
      description: ``
    },
    {
      name: 'Digital Innovation', img: 'di.png', route: 'di',
      title: '',
      description: ``
    }
    // { name: 'Ethical Hacker' },
    // { name: 'Data Scientist' },
    // { name: 'DevOps Engineer' },
    // { name: 'UI/UX Designer' },
    // { name: 'Game Developer' },
    // { name: 'Security Analyst' },
    // { name: 'Full-Stack Developer' },
    // { name: 'Network Engineer' },
    // { name: 'Mobile Developer' },
    // { name: 'Product Manager' },
    // { name: 'System Administrator' },
    // { name: 'Technical Writer' },
    // { name: 'QA Engineer' },
  ];
}
