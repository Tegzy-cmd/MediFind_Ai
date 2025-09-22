import {
  Moon,
  Sun,
  Hospital,
  Phone,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  Brain,
  Bone,
  Baby,
  Locate,
  Search,
  MapPin,
  Navigation,
  Sparkles,
  Award,
  ShieldCheck,
  PhoneCall,
  X,
  Plus,
  Trash2,
  Edit,
  User,
  Users,
  MoreVertical,
  Clock,
  Biohazard,
  BrainCircuit,
  FireExtinguisher,
  Copyright
} from 'lucide-react';

export const Icons = {
  moon: Moon,
  sun: Sun,
  hospital: Hospital,
  phone: Phone,
  alertTriangle: AlertTriangle,
  heart: HeartPulse,
  stethoscope: Stethoscope,
  brain: Brain,
  bone: Bone,
  baby: Baby,
  locate: Locate,
  search: Search,
  mapPin: MapPin,
  navigation: Navigation,
  sparkles: Sparkles,
  award: Award,
  shieldCheck: ShieldCheck,
  phoneCall: PhoneCall,
  close: X,
  add: Plus,
  trash: Trash2,
  edit: Edit,
  user: User,
  users: Users,
  moreVertical: MoreVertical,
  clock: Clock,
  biohazard: Biohazard,
  brainCircuit: BrainCircuit,
  fireExtinguisher: FireExtinguisher,
  copyright: Copyright,
};

export const CustomHospitalMarker = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-destructive drop-shadow-md"
    >
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive-foreground))"/>
        <path d="M12 11h4m-2-2v4" stroke="hsl(var(--destructive-foreground))" strokeWidth="2.5" />
    </svg>
)

export const UserMarker = () => (
    <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-md" />
)
