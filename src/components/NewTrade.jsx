import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const NewTrade = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    instrument: '',
    direction: 'Long',
    entryPrice: '',
    entryTime: '',
    exitPrice: '',
    exitTime: '',
    positionSize: '',
    leverage: 1,
    strategy: 'Custom',
    stopLoss: '',
    takeProfit: '',
    riskPercent: '',
    rewardPercent: '',
    result: 'Win',
    netPnL: '',
    rMultiple: '',
    commissions: '',
    tags: []
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const handleSave = async () => {
    try {
      setError('');
      setLoading(true);

      // Validate required fields - check if they exist and aren't empty
      if (!formData.instrument || formData.instrument.trim() === '') {
        setError('Please select an instrument');
        setLoading(false);
        return;
      }

      if (!formData.entryPrice || formData.entryPrice.trim() === '') {
        setError('Please enter entry price');
        setLoading(false);
        return;
      }

      if (!formData.direction || formData.direction.trim() === '') {
        setError('Please select a direction');
        setLoading(false);
        return;
      }

      // Safely access the instrument - use optional chaining
      const instrumentValue = formData.instrument?.toString() || '';
      
      if (instrumentValue.length === 0) {
        setError('Invalid instrument selection');
        setLoading(false);
        return;
      }

      // Prepare trade data
      const tradeData = {
        ...formData,
        entryPrice: parseFloat(formData.entryPrice) || 0,
        exitPrice: parseFloat(formData.exitPrice) || 0,
        positionSize: parseFloat(formData.positionSize) || 0,
        leverage: parseInt(formData.leverage) || 1,
        stopLoss: parseFloat(formData.stopLoss) || 0,
        takeProfit: parseFloat(formData.takeProfit) || 0,
        netPnL: parseFloat(formData.netPnL) || 0,
        rMultiple: parseFloat(formData.rMultiple) || 0,
        commissions: parseFloat(formData.commissions) || 0,
        timestamp: new Date().toISOString()
      };

      console.log('Saving trade:', tradeData);

      // Call the save function
      await onSave(tradeData);

      // Reset form on success
      setFormData({
        instrument: '',
        direction: 'Long',
        entryPrice: '',
        entryTime: '',
        exitPrice: '',
        exitTime: '',
        positionSize: '',
        leverage: 1,
        strategy: 'Custom',
        stopLoss: '',
        takeProfit: '',
        riskPercent: '',
        rewardPercent: '',
        result: 'Win',
        netPnL: '',
        rMultiple: '',
        commissions: '',
        tags: []
      });

      onClose();
    } catch (err) {
      console.error('Error saving trade:', err);
      setError(err.message || 'Failed to save trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/10 bg-bg-darker/90 backdrop-blur">
          <h2 className="text-xl font-black text-white">New Trade</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-500 font-bold text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-black uppercase text-text-muted">Basic Info</h3>
              
              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Instrument</label>
                <select
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                >
                  <option value="">Select...</option>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="XAUUSD">XAUUSD</option>
                  <option value="SPX500">SPX500</option>
                  <option value="NAS100">NAS100</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Direction</label>
                <div className="flex gap-2">
                  {['Long', 'Short'].map(dir => (
                    <button
                      key={dir}
                      onClick={() => setFormData(prev => ({ ...prev, direction: dir }))}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                        formData.direction === dir
                          ? dir === 'Long'
                            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                            : 'bg-red-500/20 text-red-500 border border-red-500/30'
                          : 'bg-white/5 text-text-secondary border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trade Details */}
            <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-black uppercase text-text-muted">Trade Details</h3>
              
              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Entry Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Exit Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="exitPrice"
                  value={formData.exitPrice}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Position Size</label>
                <input
                  type="number"
                  step="0.01"
                  name="positionSize"
                  value={formData.positionSize}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Results */}
            <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-black uppercase text-text-muted">Results</h3>
              
              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Result</label>
                <div className="flex gap-2">
                  {['Win', 'Loss'].map(res => (
                    <button
                      key={res}
                      onClick={() => setFormData(prev => ({ ...prev, result: res }))}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                        formData.result === res
                          ? res === 'Win'
                            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                            : 'bg-red-500/20 text-red-500 border border-red-500/30'
                          : 'bg-white/5 text-text-secondary border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">Net P&L</label>
                <input
                  type="number"
                  step="0.01"
                  name="netPnL"
                  value={formData.netPnL}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted mb-2 block">R Multiple</label>
                <input
                  type="number"
                  step="0.01"
                  name="rMultiple"
                  value={formData.rMultiple}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary-glow text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Trade'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewTrade;
