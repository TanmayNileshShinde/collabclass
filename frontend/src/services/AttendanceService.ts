import { supabase } from '@/lib/supabaseClient';

export interface AttendanceRecord {
  id?: string;
  meeting_id: string;
  user_id: string;
  user_name: string;
  joined_at: string;
  left_at?: string;
}

class AttendanceService {
  // Record when a user joins a meeting
  static async recordJoin(meetingId: string, userId: string, userName: string) {
    try {
      console.log('Recording join:', { meetingId, userId, userName });
      
      // Check if user already has an active session for this meeting
      const { data: existingRecord } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .is('left_at', 'null')
        .single();

      if (existingRecord) {
        console.log('User already has active session, skipping join record');
        return existingRecord;
      }

      const { data, error } = await supabase
        .from('meeting_attendance')
        .insert({
          meeting_id: meetingId,
          user_id: userId,
          user_name: userName,
          joined_at: new Date().toISOString(),
          left_at: null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording join:', error);
        throw error;
      }

      console.log('Join recorded successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to record join:', error);
      throw error;
    }
  }

  // Record when a user leaves a meeting
  static async recordLeave(meetingId: string, userId: string) {
    try {
      console.log('Recording leave:', { meetingId, userId });
      
      const { data, error } = await supabase
        .from('meeting_attendance')
        .update({
          left_at: new Date().toISOString(),
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .is('left_at', 'null')
        .select()
        .single();

      if (error) {
        console.error('Error recording leave:', error);
        throw error;
      }

      console.log('Leave recorded successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to record leave:', error);
      throw error;
    }
  }

  // Get attendance records for a specific meeting
  static async getMeetingAttendance(meetingId: string) {
    try {
      const { data, error } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('joined_at', { ascending: true });

      if (error) {
        console.error('Error fetching attendance:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      throw error;
    }
  }

  // Get all attendance records for a user
  static async getUserAttendance(userId: string) {
    try {
      const { data, error } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching user attendance:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user attendance:', error);
      throw error;
    }
  }
}

export default AttendanceService;
