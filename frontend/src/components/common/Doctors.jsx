import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Stethoscope } from 'lucide-react';

const Doctors = ({ setActiveTab }) => {
  const sampleDoctors = [
    { name: 'Dr. Ananya Sharma', specialty: 'Gynecologist', city: 'Mumbai', rating: 4.5, experience: '12 yrs', available: true },
    { name: 'Dr. Reena Mehta', specialty: 'Endocrinologist', city: 'Delhi', rating: 4.2, experience: '9 yrs', available: false },
    { name: 'Dr. Sneha Patel', specialty: 'Obstetrician', city: 'Ahmedabad', rating: 4.6, experience: '15 yrs', available: true },
    { name: 'Dr. Kavya Nair', specialty: 'Reproductive Endocrinologist', city: 'Bangalore', rating: 4.8, experience: '11 yrs', available: true },
    { name: 'Dr. Priya Joshi', specialty: 'Nutritionist & PCOS Specialist', city: 'Pune', rating: 4.4, experience: '7 yrs', available: false },
    { name: 'Dr. Meera Kapoor', specialty: 'Dermatologist (Hormonal)', city: 'Chennai', rating: 4.3, experience: '10 yrs', available: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 pb-24">
      <button
        onClick={() => setActiveTab('home')}
        className="mb-8 flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
      </button>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
          <Stethoscope size={14} />
          Verified Specialists
        </div>
        <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Find PCOS Doctors</h1>
        <p className="text-text-secondary">Connect with certified specialists experienced in PCOS & hormonal health management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDoctors.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="med-card p-6 hover:-translate-y-1 transition-all duration-300 border-white/5 hover:border-accent/30 flex flex-col gap-4"
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-lg">
                {doc.name.charAt(4)}
              </div>
              <div>
                <h3 className="font-bold text-primary leading-tight">{doc.name}</h3>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider">{doc.specialty}</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1"><MapPin size={11} />{doc.city}</span>
              <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" />{doc.rating}</span>
              <span>{doc.experience} experience</span>
            </div>

            {/* Status */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${doc.available ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-tertiary border border-white/10'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-emerald-400' : 'bg-text-tertiary'}`} />
              {doc.available ? 'Available Today' : 'Fully Booked'}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
              <button className="flex-1 py-2 text-xs font-bold rounded-xl bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-white transition-all">Book Consult</button>
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-text-secondary">
                <Phone size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;