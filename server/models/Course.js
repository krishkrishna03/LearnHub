import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: 200
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'AI/ML', 'DevOps']
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
    default: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isFree: {
    type: Boolean,
    default: function() {
      return this.price === 0;
    }
  }
}, {
  timestamps: true
});

// Calculate average rating
courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = (sum / this.reviews.length).toFixed(1);
    this.rating.count = this.reviews.length;
  }
};

// Update isFree field before saving
courseSchema.pre('save', function(next) {
  this.isFree = this.price === 0;
  next();
});

export default mongoose.model('Course', courseSchema);